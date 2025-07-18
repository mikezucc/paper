import { Router } from 'express'
import { aiService } from '../services/ai'
import { authenticate } from '../middleware/auth'
import { db } from '../utils/db'

const router = Router()

// Generate AI feedback
router.post('/feedback', authenticate, async (req, res) => {
  try {
    const { content, feedbackType, provider, apiKey, context } = req.body
    
    // Validate request
    if (!content || !feedbackType || !provider || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing required fields: content, feedbackType, provider, apiKey' 
      })
    }
    
    // Validate feedback type
    const validFeedbackTypes = ['research', 'methodology', 'analysis', 'literature', 'innovation']
    if (!validFeedbackTypes.includes(feedbackType)) {
      return res.status(400).json({ 
        error: 'Invalid feedback type. Must be one of: ' + validFeedbackTypes.join(', ') 
      })
    }
    
    // Validate provider
    const validProviders = ['openai', 'anthropic', 'grok']
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ 
        error: 'Invalid provider. Must be one of: ' + validProviders.join(', ') 
      })
    }
    
    // Generate feedback
    const feedback = await aiService.generateFeedback({
      content,
      feedbackType,
      provider,
      apiKey,
      context: context || {
        title: '',
        abstract: '',
        fullContent: content,
        selectedText: null
      }
    })
    
    // Save feedback to database if paperId is provided
    if (context?.paperId && req.user?.id) {
      await db.aIFeedback.create({
        data: {
          paperId: context.paperId,
          userId: req.user.id,
          feedbackType,
          selectedText: context.selectedText,
          feedback,
          provider
        }
      })
    }
    
    res.json({ feedback })
  } catch (error) {
    console.error('AI feedback error:', error)
    
    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({ error: 'Invalid API key' })
      }
      if (error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' })
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate feedback. Please check your API key and try again.' 
    })
  }
})

// Get feedback history for a paper
router.get('/feedback/history/:paperId', authenticate, async (req, res) => {
  try {
    const { paperId } = req.params
    const userId = req.user?.id
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    // Verify user owns the paper
    const paper = await db.paper.findFirst({
      where: {
        id: paperId,
        userId
      }
    })
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' })
    }
    
    // Get feedback history
    const feedbackHistory = await db.aIFeedback.findMany({
      where: {
        paperId,
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        feedbackType: true,
        selectedText: true,
        feedback: true,
        provider: true,
        createdAt: true
      }
    })
    
    res.json({ feedbackHistory })
  } catch (error) {
    console.error('Get feedback history error:', error)
    res.status(500).json({ error: 'Failed to retrieve feedback history' })
  }
})

// Delete a specific feedback
router.delete('/feedback/:feedbackId', authenticate, async (req, res) => {
  try {
    const { feedbackId } = req.params
    const userId = req.user?.id
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    // Verify user owns the feedback
    const feedback = await db.aIFeedback.findFirst({
      where: {
        id: feedbackId,
        userId
      }
    })
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' })
    }
    
    // Delete the feedback
    await db.aIFeedback.delete({
      where: {
        id: feedbackId
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Delete feedback error:', error)
    res.status(500).json({ error: 'Failed to delete feedback' })
  }
})

export default router