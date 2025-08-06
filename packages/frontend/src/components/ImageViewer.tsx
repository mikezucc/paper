import { useEffect } from 'react'
import styles from '../styles/components.module.css'

interface ImageViewerProps {
  src: string
  alt?: string
  onClose: () => void
}

export function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className={styles.imageViewerOverlay} onClick={onClose}>
      <div className={styles.imageViewerContainer}>
        <button 
          className={styles.imageViewerClose}
          onClick={onClose}
          aria-label="Close image viewer"
        >
          ×
        </button>
        <img 
          src={src} 
          alt={alt || 'Full size image'} 
          className={styles.imageViewerImage}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}