import mammoth from 'mammoth'
import TurndownService from 'turndown'

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Configure Turndown to handle common elements better
turndownService.addRule('strikethrough', {
  filter: ['del', 's'],
  replacement: (content: string) => `~~${content}~~`
})

export interface FileHandler {
  accept: string
  extensions: string[]
  handler: (file: File) => Promise<string>
}

// Handler for .md files
const markdownHandler: FileHandler = {
  accept: '.md,.markdown',
  extensions: ['md', 'markdown'],
  handler: async (file: File): Promise<string> => {
    const content = await file.text();
    console.log('Processing markdown file:', file.name, content);
    return content;
  }
}

// Handler for .txt files
const textHandler: FileHandler = {
  accept: '.txt',
  extensions: ['txt'],
  handler: async (file: File): Promise<string> => {
    const text = await file.text()
    // Basic text to markdown conversion
    // - Convert double line breaks to paragraph breaks
    // - Preserve single line breaks
    return text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(p => p.length > 0)
      .join('\n\n')
  }
}

// Handler for .docx files
const docxHandler: FileHandler = {
  accept: '.docx',
  extensions: ['docx'],
  handler: async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      
      if (result.messages.length > 0) {
        console.warn('Conversion warnings:', result.messages)
      }
      
      // Convert HTML to Markdown
      const markdown = turndownService.turndown(result.value)
      return markdown
    } catch (error) {
      console.error('Error converting .docx file:', error)
      throw new Error('Failed to convert .docx file. Please ensure it\'s a valid Word document.')
    }
  }
}

// Export all handlers
export const fileHandlers: FileHandler[] = [
  markdownHandler,
  textHandler,
  docxHandler,
]

// Get accepted file types string for input element
export const getAcceptedFileTypes = (): string => {
  return fileHandlers.map(h => h.accept).join(',')
}

// Process uploaded file
export const processFile = async (file: File): Promise<string> => {
  console.log('Processing file:', file.name, file.type);
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  const handler = fileHandlers.find(h => 
    h.extensions.includes(extension || '')
  )
  
  if (!handler) {
    throw new Error(`Unsupported file type: .${extension}. Supported types: .md, .txt, .docx`)
  }
  
  return await handler.handler(file)
}

// Download markdown content as file
export const downloadMarkdown = (content: string, filename: string = 'document.md') => {
  // Ensure filename ends with .md
  if (!filename.endsWith('.md')) {
    filename += '.md'
  }
  
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}