import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paper } from '@paper/shared'
import { api } from '../utils/api'
import styles from '../styles/components.module.css'

export function HomePage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/papers')
      .then(({ papers }) => setPapers(papers))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Browse Papers</h1>
      {papers.length === 0 ? (
        <p>No papers published yet.</p>
      ) : (
        <div className={styles.paperGrid}>
          {papers.map((paper) => (
            <Link
              key={paper.id}
              to={`/paper/${paper.slug}`}
              className={styles.paperCard}
            >
              <h2 className={styles.paperTitle}>{paper.title}</h2>
              <div className={styles.paperMeta}>
                {new Date(paper.createdAt).toLocaleDateString()}
              </div>
              <p className={styles.paperAbstract}>{paper.abstract}</p>
              {paper.tags.length > 0 && (
                <div className={styles.tags}>
                  {paper.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}