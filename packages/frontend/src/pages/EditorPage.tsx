import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { debounce } from 'lodash'
import { Paper, CreatePaperInput, UpdatePaperInput } from '@paper/shared'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import styles from '../styles/components.module.css'

interface Revision {
  id: string
  title: string
  message?: string
  createdAt: string
}

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
  const [showRevisions, setShowRevisions] = useState(false)
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved')
  const lastSavedIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [timeSinceLastSave, setTimeSinceLastSave] = useState('')
  const hasUnsavedChanges = useRef(false)

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
            setLastSaved(new Date())
            setSaveStatus('saved')
          }
        })
        .catch((err) => setError(err.message))
    }
  }, [id])

  // Load revisions when panel is opened
  useEffect(() => {
    if (showRevisions && paper) {
      setLoadingRevisions(true)
      api.get(`/papers/${paper.id}/revisions`)
        .then(({ revisions }) => setRevisions(revisions))
        .catch((err) => setError(err.message))
        .finally(() => setLoadingRevisions(false))
    }
  }, [showRevisions, paper])

  // Update time since last save
  useEffect(() => {
    const updateTimeSinceLastSave = () => {
      if (lastSaved) {
        const now = new Date()
        const diff = now.getTime() - lastSaved.getTime()
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        if (hours > 0) {
          setTimeSinceLastSave(`${hours}h ago`)
        } else if (minutes > 0) {
          setTimeSinceLastSave(`${minutes}m ago`)
        } else if (seconds > 5) {
          setTimeSinceLastSave(`${seconds}s ago`)
        } else {
          setTimeSinceLastSave('just now')
        }
      }
    }

    updateTimeSinceLastSave()
    lastSavedIntervalRef.current = setInterval(updateTimeSinceLastSave, 5000)

    return () => {
      if (lastSavedIntervalRef.current) {
        clearInterval(lastSavedIntervalRef.current)
      }
    }
  }, [lastSaved])

  const performSave = useCallback(async () => {
    if (!title || !hasUnsavedChanges.current) return

    setSaveStatus('saving')
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
      
      setLastSaved(new Date())
      setSaveStatus('saved')
      hasUnsavedChanges.current = false
      setError('')
    } catch (err: any) {
      setError(err.message)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }, [title, abstract, content, tags, published, paper, navigate])

  const onSaveRef = useRef(performSave);
  onSaveRef.current = performSave;

  // Create debounced save function
  const debouncedSave = useMemo(
    () => debounce(() => onSaveRef.current(), 2000),
    []
  );

  // Track changes and trigger auto-save
  useEffect(() => {
    if (paper || content) {
      hasUnsavedChanges.current = true
      setSaveStatus('unsaved')
      debouncedSave()
    }
  }, [title, abstract, content, tags, published])

  const handleManualSave = () => {
    debouncedSave.cancel()
    performSave()
  }

  const handleRestoreRevision = async (revisionId: string) => {
    if (!paper) return

    try {
      const { paper: restored } = await api.post(`/papers/${paper.id}/revisions/${revisionId}/restore`)
      setPaper(restored)
      setTitle(restored.title)
      setAbstract(restored.abstract)
      setContent(restored.content || '')
      setTags(restored.tags.join(', '))
      setShowRevisions(false)
      
      // Reload revisions
      const { revisions } = await api.get(`/papers/${paper.id}/revisions`)
      setRevisions(revisions)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleViewRevision = async (revisionId: string) => {
    if (!paper) return

    try {
      const { revision } = await api.get(`/papers/${paper.id}/revisions/${revisionId}`)
      setTitle(revision.title)
      setAbstract(revision.abstract)
      setContent(revision.content || '')
      setTags(revision.tags.join(', '))
      setSaveStatus('unsaved')
      hasUnsavedChanges.current = true
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return lastSaved ? `Saved ${timeSinceLastSave}` : 'Saved'
      case 'error':
        return 'Save failed'
      case 'unsaved':
        return 'Unsaved changes'
      default:
        return ''
    }
  }

  const formatRevisionDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
            Details
          </button>
          <button 
            className={styles.metadataToggle}
            onClick={() => setShowRevisions(!showRevisions)}
          >
            History
          </button>
        </div>
        <div className={styles.editorHeaderRight}>
          <span className={`${styles.saveStatus} ${styles[saveStatus]}`}>
            {getSaveStatusDisplay()}
          </span>
          <button 
            className={styles.saveButton}
            onClick={handleManualSave} 
            disabled={saving || !title || saveStatus === 'saved'}
          >
            Save now
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

      {showRevisions && (
        <div className={styles.revisionsPanel}>
          <div className={styles.revisionsPanelHeader}>
            <h3>Revision History</h3>
            <button 
              className={styles.closePanelButton}
              onClick={() => setShowRevisions(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.revisionsList}>
            {loadingRevisions ? (
              <div className={styles.loadingRevisions}>Loading revisions...</div>
            ) : revisions.length === 0 ? (
              <div className={styles.noRevisions}>No previous revisions</div>
            ) : (
              revisions.map((revision) => (
                <div key={revision.id} className={styles.revisionItem}>
                  <div className={styles.revisionInfo}>
                    <div className={styles.revisionTitle}>{revision.title}</div>
                    <div className={styles.revisionDate}>
                      {formatRevisionDate(revision.createdAt)}
                    </div>
                    {revision.message && (
                      <div className={styles.revisionMessage}>{revision.message}</div>
                    )}
                  </div>
                  <div className={styles.revisionActions}>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewRevision(revision.id)}
                    >
                      View
                    </button>
                    <button 
                      className={styles.restoreButton}
                      onClick={() => handleRestoreRevision(revision.id)}
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))
            )}
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