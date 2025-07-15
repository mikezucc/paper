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

    // TODO: Fetch content from R2
    return { ...paper, content: '' }
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
        contentKey: `papers/${userId}/${slug}.md`,
      },
    })

    // TODO: Save content to R2
    
    return paper
  }

  async update(userId: string, paperId: string, data: UpdatePaperInput) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    const updated = await db.paper.update({
      where: { id: paperId },
      data: {
        title: data.title,
        abstract: data.abstract,
        tags: data.tags,
        published: data.published,
      },
    })

    // TODO: Update content in R2 if provided
    
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

    // TODO: Delete content from R2
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

export const paperService = new PaperService()