import { Request, Response, NextFunction } from 'express'
import { paperService } from '../services/paper'
import { isSocialMediaBot } from './openGraph'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// Function to strip markdown and format text
function stripMarkdown(text: string): string {
  if (!text) return ''
  
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '')
  text = text.replace(/`([^`]+)`/g, '$1')
  
  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  
  // Remove headers
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1')
  
  // Remove bold and italic markers
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  
  // Remove blockquotes
  text = text.replace(/^>\s+(.+)$/gm, '$1')
  
  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '')
  
  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')
  text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1')
  
  // Replace multiple newlines with single space for meta description
  text = text.replace(/\n+/g, ' ')
  
  // Trim whitespace
  text = text.trim()
  
  return text
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cache for the index.html template
let indexHtmlTemplate: string | null = null

export async function ssrMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {  
  // Handle all paper routes
  const isPaperRoute = req.path.startsWith('/p/')

  console.log('SSR Middleware - Request Path:', req.path)
  
  if (!isPaperRoute) {
    return next()
  }

  try {
    // Extract slug from URL
    const slug = req.path.replace('/p/', '')
    
    // Get paper data
    const paper = await paperService.getBySlug(slug)
    
    // Get view count
    const viewCount = await paperService.getViewCount(paper.paper.id)
    const paperWithViewCount = { ...paper, viewCount }
    
    // Load the index.html template if not cached
    if (!indexHtmlTemplate) {
      const indexPath = path.join(__dirname, '../../../../packages/frontend/dist/index.html')
      indexHtmlTemplate = fs.readFileSync(indexPath, 'utf-8')
    }
    
    // Check if SSR build exists - try both .cjs and .js extensions
    const ssrDir = path.join(__dirname, '../../../../packages/frontend/dist-ssr')
    let ssrManifestPath = path.join(ssrDir, 'entry-server.cjs')
    
    if (!fs.existsSync(ssrManifestPath)) {
      ssrManifestPath = path.join(ssrDir, 'entry-server.js')
    }

    console.log('SSR Manifest Path:', ssrManifestPath)
    
    if (!fs.existsSync(ssrManifestPath)) {
      console.warn('SSR build not found. Run "npm run build:ssr" in frontend package.')
      return next()
    }
    
    // Import the SSR render function
    const { render } = await import(ssrManifestPath)
    
    // Render the app
    const { html: appHtml } = render({ path: req.path, paperData: paperWithViewCount })
    
    // Generate OG image URL
    const ogImageUrl = `${req.protocol}://${req.get('host')}/api/og-image/${slug}`
    
    // Strip markdown from content for description
    const contentPreview = stripMarkdown((paper.abstract || paper.content || '').substring(0, 300))
    
    // Prepare meta tags
    const metaTags = `
    <!-- Basic Meta Tags -->
    <title>${escapeHtml(paper.title)} - Paper</title>
    <meta name="description" content="${escapeHtml(contentPreview)}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${escapeHtml(paper.title)}">
    <meta property="og:description" content="${escapeHtml(contentPreview)}">
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
    <meta name="twitter:description" content="${escapeHtml(contentPreview)}">
    <meta name="twitter:image" content="${ogImageUrl}">
    
    <!-- Preload paper data for hydration -->
    <script>
      window.__PAPER_DATA__ = ${JSON.stringify(paperWithViewCount).replace(/</g, '\\u003c')};
    </script>
  `
    
    // Replace placeholders in the template
    let html = indexHtmlTemplate
    html = html.replace('</head>', `${metaTags}</head>`)
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    
    res.send(html)
  } catch (error) {
    console.error('SSR error:', error)
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