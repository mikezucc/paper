import { useMemo, useEffect } from 'react'
import { marked } from 'marked'
import Prism from 'prismjs'
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

export function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => marked(content), [content])
  
  useEffect(() => {
    Prism.highlightAll()
  }, [html])
  
  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        backgroundColor: '#faf8f5',
        color: '#3d3a34',
        padding: '24px',
        minHeight: '100%',
        fontFamily: 'Golos Text, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '16px',
        lineHeight: '1.7',
      }}
    />
  )
}