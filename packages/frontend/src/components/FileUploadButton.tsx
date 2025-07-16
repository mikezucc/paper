import React, { useRef, useState } from 'react'
import { getAcceptedFileTypes, processFile } from '../utils/fileHandlers'
import styles from '../styles/components.module.css'

interface FileUploadButtonProps {
  onFileLoad: (content: string, filename: string) => void
  className?: string
}

export function FileUploadButton({ onFileLoad, className }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const acceptedTypes = getAcceptedFileTypes()
  console.log('Accepted file types:', acceptedTypes)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected', event.target.files);
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const content = await processFile(file)
      onFileLoad(content, file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file')
      console.error('File upload error:', err)
    } finally {
      setIsLoading(false)
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="markdown-file-upload"
      />
      <label 
        htmlFor="markdown-file-upload"
        className={className || styles.uploadButton}
        style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? 'none' : 'auto'
        }}
        title="Upload markdown (.md), text (.txt), or Word (.docx) file"
      >
        {isLoading ? (
          <>📄 Loading...</>
        ) : (
          <>📄 Upload</>
        )}
      </label>
      {error && (
        <div className={styles.uploadError}>
          {error}
        </div>
      )}
    </div>
  )
}