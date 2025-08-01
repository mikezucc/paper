import sharp from 'sharp'

// Configuration for the OG image
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

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
        font-size: 48px; 
        font-weight: 700; 
        fill: #2C2416; 
      }
      .content { 
        font-family: 'Arial', 'Helvetica', sans-serif; 
        font-size: 24px; 
        font-weight: 400; 
        fill: #5C4E3C; 
      }
      .meta { 
        font-family: 'Arial', 'Helvetica', sans-serif; 
        font-size: 20px; 
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
  ${renderTitle(title)}
  
  <!-- Abstract/Content -->
  ${renderContent(abstract || content?.substring(0, 200) || '')}
  
  <!-- Bottom separator line -->
  <line x1="60" y1="${OG_IMAGE_HEIGHT - 90}" x2="${OG_IMAGE_WIDTH - 60}" y2="${OG_IMAGE_HEIGHT - 90}" stroke="#D4C5B0" stroke-width="1"/>
  
  <!-- Author -->
  <text x="60" y="${OG_IMAGE_HEIGHT - 60}" class="meta">by ${escapeXml(author)}</text>
  
  <!-- Branding -->
  <text x="${OG_IMAGE_WIDTH - 60}" y="${OG_IMAGE_HEIGHT - 60}" class="meta" text-anchor="end">Paper - Academic Publishing</text>
</svg>`

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()

  return pngBuffer
}

function renderTitle(title: string): string {
  const maxCharsPerLine = 40
  const lines = wrapTextSvg(title, maxCharsPerLine, 2)
  let y = 100
  
  return lines.map(line => {
    const result = `<text x="60" y="${y}" class="title">${escapeXml(line)}</text>`
    y += 60
    return result
  }).join('\n  ')
}

function renderContent(content: string): string {
  const maxCharsPerLine = 70
  const lines = wrapTextSvg(content, maxCharsPerLine, 4)
  let y = 240
  
  return lines.map(line => {
    const result = `<text x="60" y="${y}" class="content">${escapeXml(line)}</text>`
    y += 35
    return result
  }).join('\n  ')
}

function wrapTextSvg(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine)
      currentLine = word
      
      if (lines.length >= maxLines) {
        lines[lines.length - 1] += '...'
        break
      }
    } else {
      currentLine = testLine
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
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