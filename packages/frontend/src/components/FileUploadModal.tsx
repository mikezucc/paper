import { useState, useRef } from 'react'
import { getAcceptedFileTypes, processFile } from '../utils/fileHandlers'
import styles from '../styles/components.module.css'

interface FileUploadModalProps {
  onConfirm: (content: string, filename: string) => void
  onClose: () => void
}

export function FileUploadModal({ onConfirm, onClose }: FileUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ content: string; filename: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processSelectedFile = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const content = await processFile(file)
      setPreview({ content, filename: file.name })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file')
      console.error('File upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      await processSelectedFile(file)
    }
  }

  const handleConfirm = () => {
    if (preview) {
      onConfirm(preview.content, preview.filename)
      onClose()
    }
  }

  const handleSelectNewFile = () => {
    fileInputRef.current?.click()
  }

  const getPreviewExcerpt = (content: string, maxLength: number = 500) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.fileUploadModal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Upload File</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          {!preview ? (
            <>
              <div 
                className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="modal-file-upload"
                />
                <label 
                  htmlFor="modal-file-upload"
                  className={styles.uploadAreaLabel}
                >
                  <div className={styles.uploadIcon}>📄</div>
                  <div className={styles.uploadText}>
                    {isLoading ? 'Loading...' : isDragging ? 'Drop file here' : 'Click to select or drag & drop a file'}
                  </div>
                  <div className={styles.uploadHint}>
                    Supports .md, .txt, and .docx files
                  </div>
                </label>
              </div>
              
              {error && (
                <div className={styles.error} style={{ marginTop: '1rem' }}>
                  {error}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>
                  <strong>File:</strong> {preview.filename}
                </div>
                <button 
                  onClick={handleSelectNewFile}
                  className={styles.changeFileButton}
                >
                  Choose different file
                </button>
              </div>
              
              <div className={styles.previewContainer}>
                <h4 className={styles.previewTitle}>Preview:</h4>
                <div className={styles.previewContent}>
                  <pre>{getPreviewExcerpt(preview.content)}</pre>
                </div>
                {preview.content.length > 500 && (
                  <div className={styles.previewTruncated}>
                    Preview truncated. Full content will be loaded on confirm.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          {preview && (
            <button 
              onClick={handleConfirm}
              className={styles.primaryButton}
            >
              Load into Editor
            </button>
          )}
        </div>
      </div>
    </div>
  )
}