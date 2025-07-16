import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import styles from '../styles/components.module.css'

type ViewMode = 'card' | 'list'

interface PublishedPaper {
  id: string
  slug: string
  title: string
  abstract: string
  content?: string
  tags: string[]
  publishedAt: string
  paper: {
    id: string
    user: {
      email: string
    }
  }
}

export function HomePage() {
  const [papers, setPapers] = useState<PublishedPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>(() => 
    (localStorage.getItem('browseViewMode') as ViewMode) || 'card'
  )
  const [selectedPaper, setSelectedPaper] = useState<PublishedPaper | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/papers')
      .then(({ papers }) => {
        setPapers(papers)
        // Auto-select first paper in list view
        if (viewMode === 'list' && papers.length > 0 && !selectedPaper) {
          setSelectedPaper(papers[0])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('browseViewMode', viewMode)
  }, [viewMode])

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

  const getAuthorName = (email: string) => {
    return email.split('@')[0] // Simple extraction, could be improved
  }

  // Get all unique tags and authors from papers
  const allTags = Array.from(new Set(papers.flatMap(p => p.tags)))
  const allAuthors = Array.from(new Set(papers.map(p => p.paper.user.email)))

  // Filter papers based on search and filters
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.paper.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = tagFilter === '' || paper.tags.includes(tagFilter)
    
    const matchesAuthor = authorFilter === '' || paper.paper.user.email === authorFilter
    
    return matchesSearch && matchesTag && matchesAuthor
  })

  // Keyboard navigation for list view
  useEffect(() => {
    if (viewMode !== 'list') return

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
            navigate(`/p/${selectedPaper.slug}`)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, selectedPaper, filteredPapers, navigate])

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Browse Papers</h1>
        <div className={styles.dashboardActions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewToggleButton} ${viewMode === 'card' ? styles.active : ''}`}
              onClick={() => setViewMode('card')}
              title="Card view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button
              className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2" />
                <rect x="1" y="7" width="14" height="2" />
                <rect x="1" y="12" width="14" height="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No papers have been published yet.</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className={styles.cardViewContainer}>
          <div className={styles.filtersBar}>
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Authors</option>
              {allAuthors.map(author => (
                <option key={author} value={author}>{getAuthorName(author)}</option>
              ))}
            </select>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.cardsGrid}>
            {filteredPapers.map((paper) => (
              <Link
                key={paper.id}
                to={`/p/${paper.slug}`}
                className={styles.paperCard}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.paperCardHeader}>
                  <h2 className={styles.paperCardTitle}>{paper.title}</h2>
                </div>
                <div className={styles.paperCardMeta}>
                  <span className={styles.paperCardDate}>
                    {formatDate(paper.publishedAt)}
                  </span>
                  <span className={styles.paperCardAuthor}>
                    by {getAuthorName(paper.paper.user.email)}
                  </span>
                </div>
                <p className={styles.paperCardAbstract}>{paper.abstract}</p>
                {paper.tags.length > 0 && (
                  <div className={styles.paperCardTags}>
                    {paper.tags.map((tag, i) => (
                      <span key={i} className={styles.paperCardTag}>{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.listViewContainer}>
          <div className={styles.listSidebar}>
            <div className={styles.listFilters}>
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInputCompact}
              />
              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className={styles.filterSelectCompact}
              >
                <option value="">All Authors</option>
                {allAuthors.map(author => (
                  <option key={author} value={author}>{getAuthorName(author)}</option>
                ))}
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
                  </div>
                  <div className={styles.paperListItemMeta}>
                    <span className={styles.paperListItemDate}>{formatDate(paper.publishedAt)}</span>
                    <span className={styles.paperListItemAuthor}>
                      {getAuthorName(paper.paper.user.email)}
                    </span>
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
                      <span className={styles.paperDetailDate}>
                        Published {formatDate(selectedPaper.publishedAt)}
                      </span>
                      <span className={styles.paperDetailAuthor}>
                        by {getAuthorName(selectedPaper.paper.user.email)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.paperDetailActions}>
                    <button
                      onClick={() => navigate(`/p/${selectedPaper.slug}`)}
                      className={styles.viewButton}
                    >
                      Read
                    </button>
                  </div>
                </div>
                
                <div className={styles.paperDetailContent}>
                  {selectedPaper.abstract && <div className={styles.paperDetailSection}>
                    <h3>Abstract</h3>
                    <p>{selectedPaper.abstract}</p>
                  </div>}
                  
                  {selectedPaper.tags.length > 0 && (
                    <div className={styles.paperDetailSection}>
                      <h3>Tags</h3>
                      <div className={styles.paperDetailTags}>
                        {selectedPaper.tags.map((tag, i) => (
                          <span key={i} className={styles.paperDetailTag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPaper.content && (
                    <div className={styles.paperDetailSection}>
                      <h3>Preview</h3>
                      <div className={styles.paperDetailPreview}>
                        {selectedPaper.content.substring(0, 500)}
                        {selectedPaper.content.length > 500 && '...'}
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