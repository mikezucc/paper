import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { debounce } from 'lodash'
import { Paper, CreatePaperInput, UpdatePaperInput } from '@paper/shared'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useUndoRedo } from '../hooks/useUndoRedo'
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
  const [, setSaving] = useState(false)
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
  const [headerHovered, setHeaderHovered] = useState(false)
  const [previewRevision, setPreviewRevision] = useState<{
    id: string
    title: string
    abstract: string
    content: string
    tags: string[]
    createdAt: string
  } | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'focused'>('split')
  const [selectedFont, setSelectedFont] = useState(() => 
    localStorage.getItem('editorFont') || 'golos'
  )
  const [fontSize, setFontSize] = useState(() => 
    parseInt(localStorage.getItem('editorFontSize') || '18')
  )
  const [showToolbar, setShowToolbar] = useState(false)
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const insertRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  
  // Undo/Redo functionality
  const { addToHistory, undo, redo, canUndo, canRedo, reset } = useUndoRedo(content)

  // Font options grouped by category
  const fontCategories = {
    'Sans-serif': [
      { value: 'inter', label: 'Inter', family: "'Inter', sans-serif" },
      { value: 'open-sans', label: 'Open Sans', family: "'Open Sans', sans-serif" },
      { value: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif" },
      { value: 'raleway', label: 'Raleway', family: "'Raleway', sans-serif" },
      { value: 'montserrat', label: 'Montserrat', family: "'Montserrat', sans-serif" },
      { value: 'work-sans', label: 'Work Sans', family: "'Work Sans', sans-serif" },
      { value: 'source-sans', label: 'Source Sans 3', family: "'Source Sans 3', sans-serif" },
      { value: 'ibm-plex', label: 'IBM Plex Sans', family: "'IBM Plex Sans', sans-serif" },
      { value: 'system', label: 'System Default', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    ],
    'Serif': [
      { value: 'merriweather', label: 'Merriweather', family: "'Merriweather', serif" },
      { value: 'playfair', label: 'Playfair Display', family: "'Playfair Display', serif" },
      { value: 'lora', label: 'Lora', family: "'Lora', serif" },
      { value: 'crimson', label: 'Crimson Text', family: "'Crimson Text', serif" },
      { value: 'noto-serif', label: 'Noto Serif', family: "'Noto Serif', serif" },
      { value: 'eb-garamond', label: 'EB Garamond', family: "'EB Garamond', serif" },
      { value: 'libre-baskerville', label: 'Libre Baskerville', family: "'Libre Baskerville', serif" },
      { value: 'roboto-slab', label: 'Roboto Slab', family: "'Roboto Slab', serif" },
    ],
    'Monospace': [
      { value: 'golos', label: 'Golos Text', family: "'Golos Text', monospace" },
      { value: 'jetbrains', label: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
      { value: 'fira-code', label: 'Fira Code', family: "'Fira Code', monospace" },
      { value: 'mono', label: 'System Mono', family: '"SF Mono", Monaco, Consolas, monospace' },
    ],
  }

  // Flatten font options for easy lookup
  const allFonts = Object.values(fontCategories).flat()

  // Markdown templates
  const markdownTemplates = [
    { label: 'Link', template: '[link text](https://example.com)', cursor: 1 },
    { label: 'Image', template: '![alt text](image-url.jpg)', cursor: 2 },
    { label: 'Bold', template: '**bold text**', cursor: 2 },
    { label: 'Italic', template: '*italic text*', cursor: 1 },
    { label: 'Code Block', template: '```language\ncode here\n```', cursor: 3 },
    { label: 'Inline Code', template: '`code`', cursor: 1 },
    { label: 'Heading 1', template: '# Heading 1', cursor: 2 },
    { label: 'Heading 2', template: '## Heading 2', cursor: 3 },
    { label: 'Heading 3', template: '### Heading 3', cursor: 4 },
    { label: 'Bullet List', template: '- Item 1\n- Item 2\n- Item 3', cursor: 2 },
    { label: 'Numbered List', template: '1. Item 1\n2. Item 2\n3. Item 3', cursor: 3 },
    { label: 'Blockquote', template: '> Quote text', cursor: 2 },
    { label: 'Horizontal Rule', template: '---', cursor: 3 },
    { label: 'Table', template: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |', cursor: 2 },
    { label: 'Task List', template: '- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task', cursor: 6 },
  ]

  useEffect(() => {
    if (id) {
      api.get(`/papers/user/papers`)
        .then(({ papers }) => {
          const paper = papers.find((p: Paper) => p.id === id)
          if (paper) {
            setPaper(paper)
            setTitle(paper.title)
            setAbstract(paper.abstract)
            const paperContent = paper.content || ''
            setContent(paperContent)
            reset(paperContent)
            setTags(paper.tags.join(', '))
            setPublished(paper.published)
            setLastSaved(new Date())
            setSaveStatus('saved')
          }
        })
        .catch((err) => setError(err.message))
    }
  }, [id])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('editorFont', selectedFont)
  }, [selectedFont])

  useEffect(() => {
    localStorage.setItem('editorFontSize', fontSize.toString())
  }, [fontSize])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showInsertMenu && insertRef.current && !insertRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest(`.${styles.insertToggle}`)) {
        setShowInsertMenu(false)
      }
      if (showToolbar && toolbarRef.current && !toolbarRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest(`.${styles.toolbarToggle}`)) {
        setShowToolbar(false)
      }
      if (showContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInsertMenu, showToolbar, showContextMenu])

  // Handle right-click on textarea
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    
    // Calculate position to ensure menu stays within viewport
    const menuWidth = 220 // approximate width
    const menuHeight = 320 // approximate height
    const padding = 10
    
    let x = e.clientX
    let y = e.clientY
    
    // Adjust if menu would go outside viewport
    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding
    }
    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding
    }
    
    setContextMenuPosition({ x, y })
    setShowContextMenu(true)
  }, [])

  // Insert template at cursor position
  const insertTemplate = (template: string, cursorOffset: number) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + template + content.substring(end)
    
    setContent(newContent)
    setShowInsertMenu(false)
    
    // Set cursor position after template is inserted
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
      addToHistory(newContent, newPosition, newPosition)
    }, 0)
  }

  // Handle undo
  const handleUndo = useCallback(() => {
    const historyState = undo()
    if (historyState && textareaRef.current) {
      setContent(historyState.value)
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(historyState.selectionStart, historyState.selectionEnd)
        textareaRef.current?.focus()
      }, 0)
    }
  }, [undo])

  // Handle redo
  const handleRedo = useCallback(() => {
    const historyState = redo()
    if (historyState && textareaRef.current) {
      setContent(historyState.value)
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(historyState.selectionStart, historyState.selectionEnd)
        textareaRef.current?.focus()
      }, 0)
    }
  }, [redo])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'z' && e.shiftKey || e.key === 'y')) {
        e.preventDefault()
        handleRedo()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleUndo, handleRedo])

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

  // const handleManualSave = () => {
  //   debouncedSave.cancel()
  //   performSave()
  // }

  const handleRestoreRevision = async (revisionId: string) => {
    if (!paper) return

    try {
      const { paper: restored } = await api.post(`/papers/${paper.id}/revisions/${revisionId}/restore`)
      setPaper(restored)
      setTitle(restored.title)
      setAbstract(restored.abstract)
      const restoredContent = restored.content || ''
      setContent(restoredContent)
      reset(restoredContent)
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
      setPreviewRevision(revision)
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
      <div 
        className={styles.editorHeader}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div className={`${styles.editorHeaderLeft} ${headerHovered ? styles.visible : styles.hidden}`}>
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Paper"
          />
        </div>
        <div className={styles.editorHeaderCenter}>
          <button 
            className={styles.viewModeToggle}
            onClick={() => setViewMode(viewMode === 'split' ? 'focused' : 'split')}
            title={viewMode === 'split' ? 'Focus mode' : 'Split view'}
          >
            {viewMode === 'split' ? '⚟' : '⚏'}
          </button>
          <button 
            className={styles.toolbarToggle}
            onClick={() => setShowToolbar(!showToolbar)}
            title="Text formatting"
          >
            Aa
          </button>
          <button 
            className={styles.insertToggle}
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            title="Insert Markdown"
          >
            +
          </button>
        </div>
        <div className={`${styles.editorHeaderRight} ${headerHovered ? styles.visible : styles.hidden}`}>
          {headerHovered && (
            <>
              <span className={`${styles.saveStatus} ${styles[saveStatus]}`}>
                {getSaveStatusDisplay()}
              </span>
              {/* <button 
                className={styles.saveButton}
                onClick={handleManualSave} 
                disabled={saving || !title || saveStatus === 'saved'}
              >
                Save now
              </button> */}
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
            </>
          )}
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
        
        {showToolbar && (
          <div className={styles.toolbarPopoverContainer}>
            <div ref={toolbarRef} className={styles.toolbarPopover}>
            <div className={styles.toolbarSection}>
              <h3 className={styles.toolbarSectionTitle}>Text Formatting</h3>
              <div className={styles.toolbarRow}>
                <button 
                  className={styles.undoButton}
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo (Cmd/Ctrl + Z)"
                >
                  ↶
                </button>
                <button 
                  className={styles.redoButton}
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo (Cmd/Ctrl + Shift + Z)"
                >
                  ↷
                </button>
                <div className={styles.toolbarDivider} />
                <div className={styles.sizeControls}>
                  <button 
                    className={styles.sizeButton}
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    disabled={fontSize <= 12}
                  >
                    −
                  </button>
                  <span className={styles.sizeDisplay}>{fontSize}px</span>
                  <button 
                    className={styles.sizeButton}
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    disabled={fontSize >= 32}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.toolbarSection}>
              <h3 className={styles.toolbarSectionTitle}>Font Family</h3>
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <div key={category} className={styles.fontCategory}>
                  <h4 className={styles.fontCategoryTitle}>{category}</h4>
                  <div className={styles.fontGrid}>
                    {fonts.map(font => (
                      <button
                        key={font.value}
                        className={`${styles.fontOption} ${selectedFont === font.value ? styles.selected : ''}`}
                        onClick={() => setSelectedFont(font.value)}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      )}
      
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{
            position: 'fixed',
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
            zIndex: 1001
          }}
        >
          <h3 className={styles.contextMenuTitle}>Insert Markdown</h3>
          <div className={styles.contextMenuItems}>
            {markdownTemplates.slice(0, 8).map((item, index) => (
              <button
                key={index}
                className={styles.contextMenuItem}
                onClick={() => {
                  insertTemplate(item.template, item.cursor)
                  setShowContextMenu(false)
                }}
              >
                {item.label}
              </button>
            ))}
            <div className={styles.contextMenuDivider} />
            <button
              className={styles.contextMenuItem}
              onClick={() => {
                setShowContextMenu(false)
                setShowInsertMenu(true)
              }}
            >
              More options...
            </button>
          </div>
        </div>
      )}
      
      {showInsertMenu && (
        <div className={styles.insertPopoverContainer}>
          <div ref={insertRef} className={styles.insertPopover}>
            <h3 className={styles.insertPopoverTitle}>Insert Markdown</h3>
            <div className={styles.insertGrid}>
              {markdownTemplates.map((item, index) => (
                <button
                  key={index}
                  className={styles.insertGridItem}
                  onClick={() => insertTemplate(item.template, item.cursor)}
                  title={item.template}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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

      <div className={`${styles.editorContent} ${viewMode === 'focused' ? styles.focusedMode : ''}`}>
        <div className={styles.editorPane}>
          <textarea
            ref={textareaRef}
            className={styles.markdownTextarea}
            value={content}
            onChange={(e) => {
              const newContent = e.target.value
              setContent(newContent)
              if (textareaRef.current) {
                addToHistory(newContent, textareaRef.current.selectionStart, textareaRef.current.selectionEnd)
              }
            }}
            onContextMenu={handleContextMenu}
            placeholder="Write your paper content in Markdown..."
            style={{
              fontFamily: allFonts.find(f => f.value === selectedFont)?.family,
              fontSize: `${fontSize}px`,
              lineHeight: fontSize >= 24 ? '1.8' : '1.6'
            }}
          />
        </div>
        <div className={`${styles.editorPane} ${viewMode === 'focused' ? styles.previewPane : ''}`}>
          <div 
            className={styles.preview}
            style={{
              fontFamily: allFonts.find(f => f.value === selectedFont)?.family,
              fontSize: `${fontSize}px`,
              lineHeight: fontSize >= 24 ? '1.8' : '1.6'
            }}
          >
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
      {previewRevision && (
        <div className={styles.revisionPreviewOverlay} onClick={() => setPreviewRevision(null)}>
          <div className={styles.revisionPreviewModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.revisionPreviewHeader}>
              <div>
                <h2>{previewRevision.title}</h2>
                <div className={styles.revisionPreviewDate}>
                  Version from {formatRevisionDate(previewRevision.createdAt)}
                </div>
              </div>
              <button 
                className={styles.closePreviewButton}
                onClick={() => setPreviewRevision(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.revisionPreviewContent}>
              <div className={styles.revisionPreviewMetadata}>
                <div className={styles.revisionPreviewSection}>
                  <h4>Abstract</h4>
                  <p>{previewRevision.abstract}</p>
                </div>
                {previewRevision.tags.length > 0 && (
                  <div className={styles.revisionPreviewSection}>
                    <h4>Tags</h4>
                    <div className={styles.revisionPreviewTags}>
                      {previewRevision.tags.map((tag, i) => (
                        <span key={i} className={styles.revisionPreviewTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.revisionPreviewDivider} />
              <div className={styles.revisionPreviewMarkdown}>
                <MarkdownRenderer content={previewRevision.content || ''} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}