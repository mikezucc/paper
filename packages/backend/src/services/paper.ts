import { CreatePaperInput, UpdatePaperInput } from '@paper/shared'
import { db } from '../utils/db'
import { AppError } from '../middleware/error'

export class PaperService {
  async listPublished() {
    return db.paper.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        abstract: true,
        tags: true,
        createdAt: true,
        user: {
          select: { email: true },
        },
      },
    })
  }

  async listByUser(userId: string) {
    return db.paper.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        abstract: true,
        tags: true,
        published: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async getBySlug(slug: string) {
    const paper = await db.paper.findUnique({
      where: { slug },
      include: {
        user: {
          select: { email: true },
        },
      },
    })

    if (!paper || !paper.published) {
      throw new AppError(404, 'Paper not found')
    }

    return paper
  }

  async create(userId: string, data: CreatePaperInput) {
    const slug = this.generateSlug(data.title)
    
    const paper = await db.paper.create({
      data: {
        userId,
        slug,
        title: data.title,
        abstract: data.abstract,
        tags: data.tags,
        content: data.content || '',
      },
    })
    
    return paper
  }

  async update(userId: string, paperId: string, data: UpdatePaperInput) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    // Create a revision before updating (only if content has changed)
    if (data.content !== undefined && data.content !== paper.content) {
      await db.paperRevision.create({
        data: {
          paperId: paper.id,
          title: paper.title,
          abstract: paper.abstract,
          content: paper.content,
          tags: paper.tags,
        },
      })
    }

    const updated = await db.paper.update({
      where: { id: paperId },
      data: {
        title: data.title,
        abstract: data.abstract,
        tags: data.tags,
        published: data.published,
        content: data.content,
      },
    })
    
    return updated
  }

  async listRevisions(userId: string, paperId: string) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    return db.paperRevision.findMany({
      where: { paperId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
      },
    })
  }

  async getRevision(userId: string, paperId: string, revisionId: string) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    const revision = await db.paperRevision.findFirst({
      where: { id: revisionId, paperId },
    })

    if (!revision) {
      throw new AppError(404, 'Revision not found')
    }

    return revision
  }

  async restoreRevision(userId: string, paperId: string, revisionId: string) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    const revision = await db.paperRevision.findFirst({
      where: { id: revisionId, paperId },
    })

    if (!revision) {
      throw new AppError(404, 'Revision not found')
    }

    // Create a revision of current state before restoring
    await db.paperRevision.create({
      data: {
        paperId: paper.id,
        title: paper.title,
        abstract: paper.abstract,
        content: paper.content,
        tags: paper.tags,
        message: 'Before restore',
      },
    })

    // Restore the revision
    const updated = await db.paper.update({
      where: { id: paperId },
      data: {
        title: revision.title,
        abstract: revision.abstract,
        content: revision.content,
        tags: revision.tags,
      },
    })

    return updated
  }

  async delete(userId: string, paperId: string) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    await db.paper.delete({
      where: { id: paperId },
    })
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

export const paperService = new PaperService()