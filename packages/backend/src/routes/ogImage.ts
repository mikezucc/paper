import { Router } from 'express'
import { paperService } from '../services/paper'
import { generateOGImage } from '../services/ogImage'

export const ogImageRouter = Router()

// Cache OG images for 1 week
const OG_IMAGE_CACHE_DURATION = 60 * 60 * 24 * 7

ogImageRouter.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params
    
    // Get paper data
    const paper = await paperService.getBySlug(slug)
    
    // Generate OG image
    const imageBuffer = await generateOGImage(
      paper.title,
      paper.abstract,
      paper.user?.email || paper.paper?.user?.email || 'Anonymous',
      paper.content || undefined
    )
    
    // Set caching headers
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${OG_IMAGE_CACHE_DURATION}`,
      'Content-Length': imageBuffer.length.toString()
    })
    
    res.send(imageBuffer)
  } catch (error) {
    // Return a default image or error
    res.status(404).send('Image not found')
  }
})