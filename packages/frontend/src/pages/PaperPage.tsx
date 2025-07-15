import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper } from '@paper/shared'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import styles from '../styles/components.module.css'

export function PaperPage() {
  const { slug } = useParams<{ slug: string }>()
  const [paper, setPaper] = useState<Paper & { content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    
    api.get(`/papers/${slug}`)
      .then(({ paper }) => setPaper(paper))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

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
            By {paper.user?.email} • {new Date(paper.createdAt).toLocaleDateString()}
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
        
        <MarkdownRenderer content={paper.content || ''} />
      </article>
    </>
  )
}