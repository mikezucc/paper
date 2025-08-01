import { Request, Response, NextFunction } from 'express'
import { paperService } from '../services/paper'

// User agents for social media crawlers
const SOCIAL_MEDIA_BOTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'Applebot'
]

export function isSocialMediaBot(userAgent: string): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return SOCIAL_MEDIA_BOTS.some(bot => ua.includes(bot.toLowerCase()))
}

export async function openGraphMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userAgent = req.headers['user-agent'] || ''
  
  // Only handle paper routes for social media bots
  if (!isSocialMediaBot(userAgent) || !req.path.startsWith('/p/')) {
    return next()
  }

  try {
    // Extract slug from URL
    const slug = req.path.replace('/p/', '')
    
    // Get paper data
    const paper = await paperService.getBySlug(slug)
    
    // Generate OG image URL
    const ogImageUrl = `${req.protocol}://${req.get('host')}/api/og-image/${slug}`
    
    // Create HTML with Open Graph tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Basic Meta Tags -->
    <title>${escapeHtml(paper.title)} - Paper</title>
    <meta name="description" content="${escapeHtml(paper.abstract || paper.title)}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${escapeHtml(paper.title)}">
    <meta property="og:description" content="${escapeHtml(paper.abstract || paper.title)}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${req.protocol}://${req.get('host')}/p/${slug}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Paper">
    <meta property="article:author" content="${escapeHtml(paper.user?.email || paper.paper?.user?.email || 'Anonymous')}">
    <meta property="article:published_time" content="${paper.publishedAt}">
    ${paper.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join('\n    ')}
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(paper.title)}">
    <meta name="twitter:description" content="${escapeHtml(paper.abstract || paper.title)}">
    <meta name="twitter:image" content="${ogImageUrl}">
    
    <!-- Redirect to the actual app after a short delay -->
    <meta http-equiv="refresh" content="0; url=/p/${slug}">
</head>
<body>
    <p>Loading paper...</p>
</body>
</html>
`
    
    res.send(html)
  } catch (error) {
    // If there's an error, just continue to the normal app
    next()
  }
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}