import { useMemo, useEffect, useState, useCallback } from 'react'
import { marked } from 'marked'
import Prism from 'prismjs'
import { ImageViewer } from './ImageViewer'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import '../styles/markdown.css'

marked.setOptions({
  gfm: true,
  breaks: true,
  // Allow HTML tags in markdown
  // Note: This allows raw HTML which could be a security risk if content comes from untrusted sources
  // Since this is for user's own content, it should be safe
})

export function MarkdownRenderer({ content, font }: { content: string; font?: string }) {
  const html = useMemo(() => marked(content), [content])
  const [viewerImage, setViewerImage] = useState<{ src: string; alt?: string } | null>(null)
  
  useEffect(() => {
    Prism.highlightAll()
  }, [html])
  
  // Add double-click handler for images
  useEffect(() => {
    const handleImageDoubleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const target = mouseEvent.target as HTMLElement
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement
        setViewerImage({ src: img.src, alt: img.alt })
      }
    }
    
    // Add event listener to the markdown content container
    const markdownContainer = document.querySelector('.markdown-content')
    if (markdownContainer) {
      markdownContainer.addEventListener('dblclick', handleImageDoubleClick)
      return () => {
        markdownContainer.removeEventListener('dblclick', handleImageDoubleClick)
      }
    }
    return undefined
  }, [html])
  
  const handleCloseViewer = useCallback(() => {
    setViewerImage(null)
  }, [])
  
  // Get font family from font value
  const getFontFamily = (fontValue?: string) => {
    if (!fontValue) return 'Golos Text, -apple-system, BlinkMacSystemFont, sans-serif'
    
    const fontMap: Record<string, string> = {
      // Sans-serif
      'inter': "'Inter', sans-serif",
      'open-sans': "'Open Sans', sans-serif",
      'poppins': "'Poppins', sans-serif",
      'raleway': "'Raleway', sans-serif",
      'montserrat': "'Montserrat', sans-serif",
      'work-sans': "'Work Sans', sans-serif",
      'source-sans': "'Source Sans 3', sans-serif",
      'ibm-plex': "'IBM Plex Sans', sans-serif",
      'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      // Serif
      'merriweather': "'Merriweather', serif",
      'playfair': "'Playfair Display', serif",
      'lora': "'Lora', serif",
      'crimson': "'Crimson Text', serif",
      'noto-serif': "'Noto Serif', serif",
      'eb-garamond': "'EB Garamond', serif",
      'libre-baskerville': "'Libre Baskerville', serif",
      'roboto-slab': "'Roboto Slab', serif",
      // Monospace
      'golos': "'Golos Text', monospace",
      'jetbrains': "'JetBrains Mono', monospace",
      'fira-code': "'Fira Code', monospace",
      'mono': '"SF Mono", Monaco, Consolas, monospace',
    }
    
    return fontMap[fontValue] || fontMap['golos']
  }
  
  return (
    <>
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          backgroundColor: '#faf8f5',
          color: '#3d3a34',
          padding: '24px',
          minHeight: '100%',
          fontFamily: getFontFamily(font),
          fontSize: '16px',
          lineHeight: '1.7',
        }}
      />
      {viewerImage && (
        <ImageViewer
          src={viewerImage.src}
          alt={viewerImage.alt}
          onClose={handleCloseViewer}
        />
      )}
    </>
  )
}