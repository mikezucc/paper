import { Router } from 'express'
import { createPaperSchema, updatePaperSchema } from '@paper/shared'
import { authenticate, AuthRequest } from '../middleware/auth'
import { paperService } from '../services/paper'
// import { AppError } from '../middleware/error'

export const papersRouter = Router()

// Public routes
papersRouter.get('/', async (req, res, next) => {
  try {
    const papers = await paperService.listPublished()
    res.json({ papers })
  } catch (error) {
    next(error)
  }
})

papersRouter.get('/:slug', async (req, res, next) => {
  try {
    const paper = await paperService.getBySlug(req.params.slug)
    res.json({ paper })
  } catch (error) {
    next(error)
  }
})

// Protected routes
papersRouter.use(authenticate)

papersRouter.get('/user/papers', async (req: AuthRequest, res, next) => {
  try {
    const papers = await paperService.listByUser(req.userId!)
    res.json({ papers })
  } catch (error) {
    next(error)
  }
})

papersRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createPaperSchema.parse(req.body)
    const paper = await paperService.create(req.userId!, data)
    res.json({ paper })
  } catch (error) {
    next(error)
  }
})

papersRouter.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = updatePaperSchema.parse(req.body)
    const paper = await paperService.update(req.userId!, req.params.id, data)
    res.json({ paper })
  } catch (error) {
    next(error)
  }
})

papersRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await paperService.delete(req.userId!, req.params.id)
    res.json({ message: 'Paper deleted' })
  } catch (error) {
    next(error)
  }
})

// Revision endpoints
papersRouter.get('/:id/revisions', async (req: AuthRequest, res, next) => {
  try {
    const revisions = await paperService.listRevisions(req.userId!, req.params.id)
    res.json({ revisions })
  } catch (error) {
    next(error)
  }
})

papersRouter.get('/:id/revisions/:revisionId', async (req: AuthRequest, res, next) => {
  try {
    const revision = await paperService.getRevision(
      req.userId!,
      req.params.id,
      req.params.revisionId
    )
    res.json({ revision })
  } catch (error) {
    next(error)
  }
})

papersRouter.post('/:id/revisions/:revisionId/restore', async (req: AuthRequest, res, next) => {
  try {
    const paper = await paperService.restoreRevision(
      req.userId!,
      req.params.id,
      req.params.revisionId
    )
    res.json({ paper })
  } catch (error) {
    next(error)
  }
})

// Publishing endpoints
papersRouter.post('/:id/publish', async (req: AuthRequest, res, next) => {
  try {
    const { versionId, replaceExisting = false } = req.body // 'current' or revision ID, and whether to replace existing
    const publishedVersion = await paperService.publishVersion(
      req.userId!,
      req.params.id,
      versionId,
      replaceExisting
    )
    res.json({ publishedVersion })
  } catch (error) {
    next(error)
  }
})

papersRouter.get('/:id/published', async (req: AuthRequest, res, next) => {
  try {
    const publishedVersions = await paperService.listPublishedVersions(
      req.userId!,
      req.params.id
    )
    res.json({ publishedVersions })
  } catch (error) {
    next(error)
  }
})