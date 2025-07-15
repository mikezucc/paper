import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paper } from '@paper/shared'
import { api } from '../utils/api'
import styles from '../styles/components.module.css'

export function DashboardPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/papers/user/papers')
      .then(({ papers }) => setPapers(papers))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (paperId: string) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      await api.delete(`/papers/${paperId}`)
      setPapers(papers.filter(p => p.id !== paperId))
    }
  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Papers</h1>
        <Link to="/editor">New Paper</Link>
      </div>
      
      {papers.length === 0 ? (
        <p>You haven't created any papers yet.</p>
      ) : (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          {papers.map((paper) => (
            <div
              key={paper.id}
              style={{
                padding: 'var(--space-md)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h2 className={styles.paperTitle}>{paper.title}</h2>
                  <div className={styles.paperMeta}>
                    {paper.published ? 'Published' : 'Draft'} • {new Date(paper.updatedAt).toLocaleDateString()}
                  </div>
                  <p className={styles.paperAbstract}>{paper.abstract}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <Link to={`/editor/${paper.id}`}>Edit</Link>
                  {paper.published && (
                    <Link to={`/paper/${paper.slug}`}>View</Link>
                  )}
                  <button onClick={() => handleDelete(paper.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}