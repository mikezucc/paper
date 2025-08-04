import sharp from 'sharp'

// Configuration for the OG image
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

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
  
  // Replace multiple newlines with single newline
  text = text.replace(/\n{3,}/g, '\n\n')
  
  // Trim whitespace
  text = text.trim()
  
  return text
}

export async function generateOGImage(
  title: string,
  abstract: string,
  author: string,
  content?: string
): Promise<Buffer> {
  // Generate SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" viewBox="0 0 ${OG_IMAGE_WIDTH} ${OG_IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { 
        font-family: 'Arial', 'Helvetica', sans-serif; 
        font-size: 80px; 
        font-weight: 700; 
        fill: #2C2416; 
      }
      .content { 
        font-family: 'Arial', 'Helvetica', sans-serif; 
        font-size: 36px; 
        font-weight: 400; 
        fill: #5C4E3C; 
      }
      .meta { 
        font-family: 'Arial', 'Helvetica', sans-serif; 
        font-size: 28px; 
        font-weight: 400; 
        fill: #8B7D6B; 
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" fill="#F7F3ED"/>
  
  <!-- Border -->
  <rect x="1" y="1" width="${OG_IMAGE_WIDTH - 2}" height="${OG_IMAGE_HEIGHT - 2}" fill="none" stroke="#E0D2BB" stroke-width="2"/>
  
  <!-- Title -->
  ${renderTitle(stripMarkdown(title))}
  
  <!-- Abstract/Content -->
  ${renderContent(stripMarkdown(abstract || content?.substring(0, 500) || ''))}
  
  <!-- Bottom separator line -->
  <line x1="60" y1="${OG_IMAGE_HEIGHT - 90}" x2="${OG_IMAGE_WIDTH - 60}" y2="${OG_IMAGE_HEIGHT - 90}" stroke="#D4C5B0" stroke-width="1"/>
  
  <!-- Author -->
  <text x="60" y="${OG_IMAGE_HEIGHT - 60}" class="meta">by ${escapeXml(author)}</text>
  
  <!-- Branding -->
  <text x="${OG_IMAGE_WIDTH - 60}" y="${OG_IMAGE_HEIGHT - 60}" class="meta" text-anchor="end">Paper - Loud Thoughts Quietly</text>
</svg>`

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()

  return pngBuffer
}

function renderTitle(title: string): string {
  const maxCharsPerLine = 25
  const lines = wrapTextSvg(title, maxCharsPerLine, 2)
  let y = 100
  
  return lines.map(line => {
    const result = `<text x="60" y="${y}" class="title">${escapeXml(line)}</text>`
    y += 95
    return result
  }).join('\n  ')
}

function renderContent(content: string): string {
  const maxCharsPerLine = 50
  const lines = wrapTextSvg(content, maxCharsPerLine, 5)
  let y = 270
  
  return lines.map(line => {
    // Skip rendering for empty lines but still increment y for spacing
    if (!line.trim()) {
      y += 25 // Smaller spacing for paragraph breaks
      return ''
    }
    const result = `<text x="60" y="${y}" class="content">${escapeXml(line)}</text>`
    y += 50
    return result
  }).filter(Boolean).join('\n  ')
}

function wrapTextSvg(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  // First split by newlines to preserve paragraph structure
  const paragraphs = text.split('\n').filter(p => p.trim())
  const lines: string[] = []
  
  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/)
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine)
        currentLine = word
        
        if (lines.length >= maxLines) {
          // Add ellipsis to the last line if we're truncating
          lines[lines.length - 1] = lines[lines.length - 1].substring(0, maxCharsPerLine - 3) + '...'
          return lines
        }
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine)
    }
    
    // Add empty line between paragraphs if there's room
    if (lines.length < maxLines - 1 && paragraphs.indexOf(paragraph) < paragraphs.length - 1) {
      lines.push('') // This will create visual spacing between paragraphs
    }
  }
  
  return lines
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}