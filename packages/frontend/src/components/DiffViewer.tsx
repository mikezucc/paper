import { useEffect, useState } from 'react'
import { generateDiff, generateSideBySideDiff, DiffResult, DiffLine } from '../utils/diff'
import styles from '../styles/components.module.css'

interface DiffViewerProps {
  oldContent: string
  newContent: string
  oldTitle?: string
  newTitle?: string
  viewMode?: 'unified' | 'side-by-side'
}

export function DiffViewer({ 
  oldContent, 
  newContent, 
  oldTitle = 'Previous Version',
  newTitle = 'Current Version',
  viewMode = 'unified' 
}: DiffViewerProps) {
  const [diff, setDiff] = useState<DiffResult | null>(null)
  const [sideBySide, setSideBySide] = useState<{ left: DiffLine[], right: DiffLine[] } | null>(null)

  useEffect(() => {
    const diffResult = generateDiff(oldContent, newContent)
    setDiff(diffResult)
    
    if (viewMode === 'side-by-side') {
      const sideBySideResult = generateSideBySideDiff(oldContent, newContent)
      setSideBySide(sideBySideResult)
    }
  }, [oldContent, newContent, viewMode])

  if (!diff) return null

  const renderLineNumber = (num: number | undefined) => {
    return num ? <span className={styles.diffLineNumber}>{num}</span> : <span className={styles.diffLineNumber}>&nbsp;</span>
  }

  const renderUnifiedDiff = () => {
    return (
      <div className={styles.diffContainer}>
        <div className={styles.diffHeader}>
          <span className={styles.diffOldTitle}>{oldTitle}</span>
          <span className={styles.diffArrow}>→</span>
          <span className={styles.diffNewTitle}>{newTitle}</span>
        </div>
        <div className={styles.diffStats}>
          <span className={styles.diffAdditions}>+{diff.additions}</span>
          <span className={styles.diffDeletions}>-{diff.deletions}</span>
          <span className={styles.diffUnchanged}>{diff.unchanged} unchanged</span>
        </div>
        <div className={styles.diffContent}>
          {diff.lines.map((line, index) => (
            <div 
              key={index} 
              className={`${styles.diffLine} ${styles[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`]}`}
            >
              {renderLineNumber(line.oldLineNumber)}
              {renderLineNumber(line.newLineNumber)}
              <span className={styles.diffLineContent}>
                <span className={styles.diffLinePrefix}>
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.content || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSideBySideDiff = () => {
    if (!sideBySide) return null

    return (
      <div className={styles.diffContainer}>
        <div className={styles.diffSideBySide}>
          <div className={styles.diffSide}>
            <div className={styles.diffSideHeader}>{oldTitle}</div>
            <div className={styles.diffSideContent}>
              {sideBySide.left.map((line, index) => (
                <div 
                  key={index} 
                  className={`${styles.diffLine} ${line.type !== 'unchanged' ? styles[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`] : ''}`}
                >
                  {renderLineNumber(line.oldLineNumber || line.lineNumber)}
                  <span className={styles.diffLineContent}>
                    {line.content || '\u00A0'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.diffSide}>
            <div className={styles.diffSideHeader}>{newTitle}</div>
            <div className={styles.diffSideContent}>
              {sideBySide.right.map((line, index) => (
                <div 
                  key={index} 
                  className={`${styles.diffLine} ${line.type !== 'unchanged' ? styles[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`] : ''}`}
                >
                  {renderLineNumber(line.newLineNumber || line.lineNumber)}
                  <span className={styles.diffLineContent}>
                    {line.content || '\u00A0'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.diffStats}>
          <span className={styles.diffAdditions}>+{diff.additions}</span>
          <span className={styles.diffDeletions}>-{diff.deletions}</span>
          <span className={styles.diffUnchanged}>{diff.unchanged} unchanged</span>
        </div>
      </div>
    )
  }

  return viewMode === 'unified' ? renderUnifiedDiff() : renderSideBySideDiff()
}