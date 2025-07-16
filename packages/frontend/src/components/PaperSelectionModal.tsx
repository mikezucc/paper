import { useState } from 'react'
import styles from '../styles/components.module.css'

interface Paper {
  id: string
  title: string
  abstract: string
  updatedAt: string
}

interface PaperSelectionModalProps {
  papers: Paper[]
  onSelect: (paper: Paper) => void
  onCancel: () => void
}

export function PaperSelectionModal({ papers, onSelect, onCancel }: PaperSelectionModalProps) {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return `${diffInMinutes} minutes ago`
      }
      return `${diffInHours} hours ago`
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={styles.paperSelectionOverlay} onClick={onCancel}>
      <div className={styles.paperSelectionModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.paperSelectionHeader}>
          <h2>Select Paper to Merge</h2>
          <button className={styles.closePaperSelectionButton} onClick={onCancel}>
            ✕
          </button>
        </div>
        
        <div className={styles.paperSelectionSearch}>
          <input
            type="text"
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.paperSearchInput}
          />
        </div>

        <div className={styles.paperSelectionList}>
          {filteredPapers.length === 0 ? (
            <div className={styles.noPapersFound}>No papers found</div>
          ) : (
            filteredPapers.map(paper => (
              <div
                key={paper.id}
                className={`${styles.paperSelectionItem} ${
                  selectedPaper?.id === paper.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedPaper(paper)}
              >
                <div className={styles.paperSelectionTitle}>{paper.title}</div>
                <div className={styles.paperSelectionAbstract}>
                  {paper.abstract.length > 150 
                    ? paper.abstract.substring(0, 150) + '...' 
                    : paper.abstract
                  }
                </div>
                <div className={styles.paperSelectionDate}>
                  Last modified: {formatDate(paper.updatedAt)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.paperSelectionFooter}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={() => selectedPaper && onSelect(selectedPaper)}
            className={styles.selectPaperButton}
            disabled={!selectedPaper}
          >
            Select Paper
          </button>
        </div>
      </div>
    </div>
  )
}