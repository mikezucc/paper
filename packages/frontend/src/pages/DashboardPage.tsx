import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Paper } from '@paper/shared'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useMobileToggle } from '../hooks/useMobileToggle'
import styles from '../styles/components.module.css'

export function DashboardPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const navigate = useNavigate()
  const { isMobile, isOpen, toggle } = useMobileToggle()

  useEffect(() => {
    api.get('/papers/user/papers')
      .then(({ papers }) => {
        setPapers(papers)
        // Auto-select first paper
        if (papers.length > 0 && !selectedPaper) {
          setSelectedPaper(papers[0])
        }
      })
      .finally(() => setLoading(false))
  }, [])


  const handleDelete = async (paperId: string) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      await api.delete(`/papers/${paperId}`)
      setPapers(papers.filter(p => p.id !== paperId))
      if (selectedPaper?.id === paperId) {
        setSelectedPaper(null)
      }
    }
  }

  const formatDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return 'Unknown date'
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Unknown date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Unknown date'
    }
  }

  // Get all unique tags from papers
  const allTags = Array.from(new Set(papers.flatMap(p => p.tags)))

  // Filter papers based on search and filters
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesTag = tagFilter === '' || paper.tags.includes(tagFilter)
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && paper.published) ||
      (statusFilter === 'draft' && !paper.published)
    
    return matchesSearch && matchesTag && matchesStatus
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = filteredPapers.findIndex(p => p.id === selectedPaper?.id)
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (currentIndex > 0) {
            setSelectedPaper(filteredPapers[currentIndex - 1])
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (currentIndex < filteredPapers.length - 1) {
            setSelectedPaper(filteredPapers[currentIndex + 1])
          }
          break
        case 'Enter':
          e.preventDefault()
          if (selectedPaper) {
            navigate(`/editor/${selectedPaper.id}`)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPaper, filteredPapers, navigate])

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.dashboardContainer}>
      {papers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't created any papers yet.</p>
          <Link to="/editor" className={styles.newPaperButtonLarge}>Create your first paper</Link>
        </div>
      ) : (
        <div className={styles.listViewContainer}>
          <div className={`${styles.listSidebar} ${isMobile && !isOpen ? styles.collapsed : ''}`}>
            {isMobile && (
              <div className={`${styles.mobileToggle} ${isOpen ? styles.open : ''}`} onClick={toggle}>
                <span>My Papers ({filteredPapers.length})</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            )}
            <div className={styles.listFilters}>
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInputCompact}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                className={styles.filterSelectCompact}
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className={styles.filterSelectCompact}
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.papersList}>
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className={`${styles.paperListItem} ${selectedPaper?.id === paper.id ? styles.selected : ''}`}
                  onClick={() => setSelectedPaper(paper)}
                >
                  <div className={styles.paperListItemHeader}>
                    <span className={styles.paperListItemTitle}>{paper.title}</span>
                    <span className={`${styles.statusDot} ${paper.published ? styles.published : styles.draft}`} />
                  </div>
                  <div className={styles.paperListItemMeta}>
                    <span className={styles.paperListItemDate}>{formatDate(paper.updatedAt)}</span>
                    {paper.tags.length > 0 && (
                      <span className={styles.paperListItemTags}>{paper.tags.length} tags</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.listDetail}>
            {selectedPaper ? (
              <div className={styles.paperDetail}>
                <div className={styles.paperDetailHeader}>
                  <div>
                    <h2 className={styles.paperDetailTitle}>{selectedPaper.title}</h2>
                    <div className={styles.paperDetailMeta}>
                      <span className={`${styles.statusBadge} ${selectedPaper.published ? styles.published : styles.draft}`}>
                        {selectedPaper.published ? 'Published' : 'Draft'}
                      </span>
                      <span className={styles.paperDetailDate}>
                        Last updated {formatDate(selectedPaper.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.paperDetailActions}>
                    <button
                      onClick={() => navigate(`/editor/${selectedPaper.id}`)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    {selectedPaper.published && (
                      <button
                        onClick={() => navigate(`/paper/${selectedPaper.slug}`)}
                        className={styles.viewButton}
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedPaper.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className={styles.paperDetailContent}>
                  {selectedPaper.abstract && <div className={styles.paperDetailSection}>
                    <p>{selectedPaper.abstract}</p>
                  </div>}
                  
                  {selectedPaper.tags.length > 0 && (
                    <div className={styles.paperDetailSection}>
                      <div className={styles.paperDetailTags}>
                        {selectedPaper.tags.map((tag, i) => (
                          <span key={i} className={styles.paperDetailTag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPaper.content && (
                    <div className={styles.paperDetailSection}>
                      <div className={styles.paperDetailMarkdownPreview}>
                        <MarkdownRenderer 
                          content={selectedPaper.content.length > 1000 
                            ? selectedPaper.content.substring(0, 1000) + '...' 
                            : selectedPaper.content
                          } 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                <p>Select a paper from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}