import { useState, useEffect } from 'react'
import { identifyChangeGroups, applySelectedChanges, ChangeGroup } from '../utils/merge'
import { DiffViewer } from './DiffViewer'
import styles from '../styles/components.module.css'

interface MergeViewProps {
  baseContent: string
  incomingContent: string
  baseTitle: string
  incomingTitle: string
  onApply: (mergedContent: string) => void
  onCancel: () => void
}

export function MergeView({
  baseContent,
  incomingContent,
  baseTitle,
  incomingTitle,
  onApply,
  onCancel
}: MergeViewProps) {
  const [changeGroups, setChangeGroups] = useState<ChangeGroup[]>([])
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [previewContent, setPreviewContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const groups = identifyChangeGroups(baseContent, incomingContent)
    setChangeGroups(groups)
    // Select all groups by default
    setSelectedGroups(new Set(groups.map(g => g.id)))
  }, [baseContent, incomingContent])

  useEffect(() => {
    // Update preview whenever selection changes
    const merged = applySelectedChanges(baseContent, incomingContent, selectedGroups)
    setPreviewContent(merged)
  }, [baseContent, incomingContent, selectedGroups])

  const toggleGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroups)
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId)
    } else {
      newSelected.add(groupId)
    }
    setSelectedGroups(newSelected)
  }

  const selectAll = () => {
    setSelectedGroups(new Set(changeGroups.map(g => g.id)))
  }

  const deselectAll = () => {
    setSelectedGroups(new Set())
  }

  const handleApply = () => {
    const mergedContent = applySelectedChanges(baseContent, incomingContent, selectedGroups)
    onApply(mergedContent)
  }

  return (
    <div className={styles.mergeView}>
      <div className={styles.mergeHeader}>
        <h2>Merge Changes</h2>
        <p className={styles.mergeDescription}>
          Select which changes from "{incomingTitle}" to apply to "{baseTitle}"
        </p>
      </div>

      <div className={styles.mergeActions}>
        <button onClick={selectAll} className={styles.selectAllButton}>
          Select All
        </button>
        <button onClick={deselectAll} className={styles.deselectAllButton}>
          Deselect All
        </button>
        <button 
          onClick={() => setShowPreview(!showPreview)} 
          className={styles.togglePreviewButton}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className={styles.mergeContent}>
        <div className={styles.changeGroupsList}>
          <h3>Change Groups</h3>
          {changeGroups.length === 0 ? (
            <p className={styles.noChanges}>No changes to merge</p>
          ) : (
            changeGroups.map(group => (
              <div 
                key={group.id} 
                className={`${styles.changeGroup} ${selectedGroups.has(group.id) ? styles.selected : ''}`}
              >
                <label className={styles.changeGroupLabel}>
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(group.id)}
                    onChange={() => toggleGroup(group.id)}
                    className={styles.changeGroupCheckbox}
                  />
                  <div className={styles.changeGroupInfo}>
                    <div className={styles.changeGroupTitle}>{group.title}</div>
                    <div className={styles.changeGroupDescription}>{group.description}</div>
                    <div className={`${styles.changeGroupType} ${styles[group.type]}`}>
                      {group.type}
                    </div>
                  </div>
                </label>
                <div className={styles.changeGroupPreview}>
                  {group.lines.slice(0, 3).map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`${styles.previewLine} ${styles[line.type]}`}
                    >
                      <span className={styles.linePrefix}>
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      {line.content}
                    </div>
                  ))}
                  {group.lines.length > 3 && (
                    <div className={styles.moreLines}>
                      ...and {group.lines.length - 3} more lines
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showPreview && (
          <div className={styles.mergePreview}>
            <h3>Preview</h3>
            <DiffViewer
              oldContent={baseContent}
              newContent={previewContent}
              oldTitle={baseTitle}
              newTitle="Merged Result"
              viewMode="unified"
            />
          </div>
        )}
      </div>

      <div className={styles.mergeFooter}>
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button 
          onClick={handleApply} 
          className={styles.applyMergeButton}
          disabled={selectedGroups.size === 0}
        >
          Apply Selected Changes ({selectedGroups.size} of {changeGroups.length})
        </button>
      </div>
    </div>
  )
}