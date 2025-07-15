import { useMemo } from 'react'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => md.render(content), [content])
  
  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}