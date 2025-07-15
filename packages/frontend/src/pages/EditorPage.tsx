import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Paper, CreatePaperInput, UpdatePaperInput } from '@paper/shared'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import styles from '../styles/components.module.css'

export function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [paper, setPaper] = useState<Paper | null>(null)
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showMetadata, setShowMetadata] = useState(false)

  useEffect(() => {
    if (id) {
      api.get(`/papers/user/papers`)
        .then(({ papers }) => {
          const paper = papers.find((p: Paper) => p.id === id)
          if (paper) {
            setPaper(paper)
            setTitle(paper.title)
            setAbstract(paper.abstract)
            setContent(paper.content || '')
            setTags(paper.tags.join(', '))
            setPublished(paper.published)
          }
        })
        .catch((err) => setError(err.message))
    }
  }, [id])

  const handleSave = async () => {
    setError('')
    setSaving(true)

    try {
      const paperData = {
        title,
        abstract,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      if (paper) {
        const updateData: UpdatePaperInput = { ...paperData, published }
        const { paper: updated } = await api.put(`/papers/${paper.id}`, updateData)
        setPaper(updated)
      } else {
        const createData: CreatePaperInput = paperData
        const { paper: created } = await api.post('/papers', createData)
        setPaper(created)
        navigate(`/editor/${created.id}`, { replace: true })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.fullPageEditor}>
      <div className={styles.editorHeader}>
        <div className={styles.editorHeaderLeft}>
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Paper"
          />
          <button 
            className={styles.metadataToggle}
            onClick={() => setShowMetadata(!showMetadata)}
          >
            {showMetadata ? '✕' : '☰'} Details
          </button>
        </div>
        <div className={styles.editorHeaderRight}>
          <button 
            className={styles.saveButton}
            onClick={handleSave} 
            disabled={saving || !title}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {paper && (
            <label className={styles.publishToggle}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>Published</span>
            </label>
          )}
          <Link to="/dashboard" className={styles.exitButton}>✕</Link>
        </div>
      </div>

      {showMetadata && (
        <div className={styles.metadataPanel}>
          <div className={styles.metadataContent}>
            <div className={styles.formGroup}>
              <label htmlFor="abstract" className={styles.label}>Abstract</label>
              <textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Brief description of your paper"
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tags" className={styles.label}>Tags (comma-separated)</label>
              <input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </div>
      )}

      {error && <div className={styles.editorError}>{error}</div>}

      <div className={styles.editorContent}>
        <div className={styles.editorPane}>
          <textarea
            className={styles.markdownTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your paper content in Markdown..."
          />
        </div>
        <div className={styles.editorPane}>
          <div className={styles.preview}>
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}