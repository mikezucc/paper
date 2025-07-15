import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
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
    <div className={styles.container} style={{ padding: 'var(--space-md) 0' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <div className={styles.form} style={{ maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Paper title"
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

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <button onClick={handleSave} disabled={saving || !title}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            {paper && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Published
              </label>
            )}
            <Link to="/dashboard">Back to Dashboard</Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>

      <div className={styles.editor}>
        <div className={styles.editorPane}>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: 'Golos Text, monospace',
              lineHeight: 24,
              padding: { top: 16, bottom: 16 },
              wordWrap: 'on',
              lineNumbers: 'off',
              folding: false,
              scrollBeyondLastLine: false,
            }}
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