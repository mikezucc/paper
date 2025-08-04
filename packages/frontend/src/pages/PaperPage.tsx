import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useOpenGraph } from '../hooks/useOpenGraph'
import styles from '../styles/components.module.css'

interface PublishedPaper {
  id: string
  slug: string
  title: string
  abstract: string
  content: string | null
  tags: string[]
  font?: string
  publishedAt: string
  user?: {
    email: string
  }
  paper?: {
    user: {
      email: string
    }
  }
  viewCount?: number
}

export function PaperPage() {
  const { slug } = useParams<{ slug: string }>()
  // Check for SSR data
  const initialData = typeof window !== 'undefined' && (window as any).__PAPER_DATA__
  const [paper, setPaper] = useState<PublishedPaper | null>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug || initialData) return
    
    api.get(`/papers/${slug}`)
      .then(({ paper }) => setPaper(paper))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug, initialData])

  // Clean up SSR data after use
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__PAPER_DATA__) {
      delete (window as any).__PAPER_DATA__
    }
  }, [])

  // Set Open Graph meta tags
  useOpenGraph({
    title: paper?.title || '',
    description: paper?.abstract || paper?.title || '',
    image: paper ? `${window.location.origin}/api/og-image/${slug}` : undefined,
    url: window.location.href,
    type: 'article',
    siteName: 'Paper',
    author: paper?.user?.email || paper?.paper?.user?.email || 'Anonymous',
    publishedTime: paper?.publishedAt,
    tags: paper?.tags || []
  })

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      const progressBar = document.getElementById('reading-progress')
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return <div className={styles.contentContainer}>Loading...</div>
  }

  if (error || !paper) {
    return <div className={styles.contentContainer}>Paper not found</div>
  }

  return (
    <>
      <div id="reading-progress" className={styles.readingProgress} style={{ transform: 'scaleX(0)' }} />
      
      <article className={styles.contentContainer}>
        <header style={{ marginBottom: 'var(--space-xl)' }}>
          <h1>{paper.title}</h1>
          <div className={styles.paperMeta}>
            {paper.user?.email || paper.paper?.user?.email || 'Anonymous'} • {new Date(paper.publishedAt).toLocaleDateString()}
            {paper.viewCount !== undefined && (
              <> • {paper.viewCount} {paper.viewCount === 1 ? 'view' : 'views'}</>
            )}
          </div>
          {paper.abstract && (
            <p style={{ fontSize: 'var(--size-lg)', fontStyle: 'italic', marginTop: 'var(--space-md)' }}>
              {paper.abstract}
            </p>
          )}
          {paper.tags.length > 0 && (
            <div className={styles.tags} style={{ marginTop: 'var(--space-md)' }}>
              {paper.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <MarkdownRenderer content={paper.content || ''} font={paper.font} />
      </article>
    </>
  )
}