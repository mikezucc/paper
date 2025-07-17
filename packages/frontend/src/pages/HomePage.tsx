import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useMobileToggle } from '../hooks/useMobileToggle'
import styles from '../styles/components.module.css'

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
  viewCount?: number
}

export function HomePage() {
  const [papers, setPapers] = useState<PublishedPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPaper, setSelectedPaper] = useState<PublishedPaper | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [authorFilter, setAuthorFilter] = useState<string>('')
  const navigate = useNavigate()
  const { isMobile, isOpen, toggle } = useMobileToggle()

  useEffect(() => {
    api.get('/papers')
      .then(({ papers }) => {
        setPapers(papers)
        // Auto-select first paper
        if (papers.length > 0 && !selectedPaper) {
          setSelectedPaper(papers[0])
        }
      })
      .finally(() => setLoading(false))
  }, [])


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
            navigate(`/p/${selectedPaper.slug}`)
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
          <p>No papers have been published yet.</p>
        </div>
      ) : isMobile ? (
        // Mobile view - Grid layout
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <div className={styles.dashboardHeaderContent}>
              <div className={styles.dashboardHeaderFilters}>
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
            </div>
          </div>
          <div className={styles.papersGrid}>
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className={styles.paperGridCard}
                onClick={() => navigate(`/p/${paper.slug}`)}
              >
                <h3 className={styles.paperGridTitle}>{paper.title}</h3>
                {paper.abstract && (
                  <p className={styles.paperGridAbstract}>{paper.abstract}</p>
                )}
                <div className={styles.paperGridMeta}>
                  <span>{formatDate(paper.publishedAt)}</span>
                  {paper.viewCount !== undefined && (
                    <span>{paper.viewCount} views</span>
                  )}
                </div>
                {paper.tags.length > 0 && (
                  <div className={styles.paperGridTags}>
                    {paper.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={styles.paperGridTag}>{tag}</span>
                    ))}
                    {paper.tags.length > 3 && (
                      <span className={styles.paperGridTag}>+{paper.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Desktop view - List layout
        <div className={styles.listViewContainer}>
          <div className={`${styles.listSidebar} ${isMobile && !isOpen ? styles.collapsed : ''}`}>
            {isMobile && (
              <div className={`${styles.mobileToggle} ${isOpen ? styles.open : ''}`} onClick={toggle}>
                <span>Filter Papers ({filteredPapers.length})</span>
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
                    {paper.viewCount !== undefined && (
                      <span className={styles.paperListItemMeta}>
                        {paper.viewCount} {paper.viewCount === 1 ? 'view' : 'views'}
                      </span>
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
                      <span className={styles.paperDetailDate}>
                        {formatDate(selectedPaper.publishedAt)}
                      </span>
                      <span className={styles.paperDetailAuthor}>
                        {getAuthorName(selectedPaper.paper.user.email)}
                      </span>
                      {selectedPaper.viewCount !== undefined && (
                        <span className={styles.paperDetailViews}>
                          {selectedPaper.viewCount} {selectedPaper.viewCount === 1 ? 'view' : 'views'}
                        </span>
                      )}
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