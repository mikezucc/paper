import { CreatePaperInput, UpdatePaperInput } from '@paper/shared'
import { db } from '../utils/db'
import { AppError } from '../middleware/error'

export class PaperService {
  async listPublished() {
    // Returns only canonical published versions (not replaced ones)
    return db.publishedVersion.findMany({
      where: { replacedById: null },
      orderBy: { publishedAt: 'desc' },
      include: {
        paper: {
          select: {
            id: true,
            user: {
              select: { email: true },
            },
          },
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
    // Now looks up published versions by slug
    const publishedVersion = await db.publishedVersion.findUnique({
      where: { slug },
      include: {
        paper: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    })

    if (!publishedVersion) {
      throw new AppError(404, 'Published version not found')
    }

    // Return in a format compatible with existing frontend
    return {
      ...publishedVersion,
      user: publishedVersion.paper.user,
    }
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

  async publishVersion(userId: string, paperId: string, versionId: string, replaceExisting: boolean = false) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
      include: {
        canonicalPublishedVersion: true,
      },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    let title: string
    let abstract: string
    let content: string | null
    let tags: string[]
    let revisionId: string | null = null

    if (versionId === 'current') {
      // Publish current version
      title = paper.title
      abstract = paper.abstract
      content = paper.content
      tags = paper.tags
    } else {
      // Publish specific revision
      const revision = await db.paperRevision.findFirst({
        where: {
          id: versionId,
          paperId: paperId,
        },
      })

      if (!revision) {
        throw new AppError(404, 'Revision not found')
      }

      title = revision.title
      abstract = revision.abstract
      content = revision.content
      tags = revision.tags
      revisionId = revision.id
    }

    // Generate unique slug for this published version
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
    const slug = `${baseSlug}-${timestamp}-${randomSuffix}`

    // Use a transaction to ensure consistency
    const publishedVersion = await db.$transaction(async (tx) => {
      // Create the new published version
      const newVersion = await tx.publishedVersion.create({
        data: {
          paperId,
          revisionId,
          slug,
          title,
          abstract,
          content,
          tags,
        },
      })

      // If replacing existing version
      if (replaceExisting && paper.canonicalPublishedVersionId) {
        // Mark the old version as replaced
        await tx.publishedVersion.update({
          where: { id: paper.canonicalPublishedVersionId },
          data: { replacedById: newVersion.id },
        })
      }

      // Update paper to point to new canonical version
      await tx.paper.update({
        where: { id: paperId },
        data: { 
          canonicalPublishedVersionId: newVersion.id,
          published: true,
        },
      })

      return newVersion
    })

    return publishedVersion
  }

  async listPublishedVersions(userId: string, paperId: string) {
    const paper = await db.paper.findFirst({
      where: { id: paperId, userId },
      select: { 
        id: true, 
        canonicalPublishedVersionId: true 
      },
    })

    if (!paper) {
      throw new AppError(404, 'Paper not found')
    }

    const publishedVersions = await db.publishedVersion.findMany({
      where: { paperId },
      orderBy: { publishedAt: 'desc' },
      include: {
        revision: {
          select: {
            id: true,
            message: true,
            createdAt: true,
          },
        },
        replacedBy: {
          select: {
            id: true,
            slug: true,
            publishedAt: true,
          },
        },
      },
    })

    // Add a flag to indicate if this is the canonical version
    const publishedVersionsWithCanonical = publishedVersions.map(version => ({
      ...version,
      isCanonical: version.id === paper.canonicalPublishedVersionId,
    }))

    return publishedVersionsWithCanonical
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

export const paperService = new PaperService()