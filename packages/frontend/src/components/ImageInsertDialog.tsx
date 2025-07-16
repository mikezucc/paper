import { useState } from 'react'
import styles from '../styles/components.module.css'

interface ImageInsertDialogProps {
  onInsert: (html: string) => void
  onClose: () => void
}

export function ImageInsertDialog({ onInsert, onClose }: ImageInsertDialogProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'none'>('none')

  const handleInsert = () => {
    if (!imageUrl) return

    let imgTag = `<img src="${imageUrl}" alt="${altText}"`
    
    // Add dimensions if provided
    if (width) {
      imgTag += ` width="${width}"`
    }
    if (height) {
      imgTag += ` height="${height}"`
    }
    
    // Add style for alignment
    if (alignment !== 'none') {
      const styleMap = {
        left: 'float: left; margin-right: 1em;',
        right: 'float: right; margin-left: 1em;',
        center: 'display: block; margin: 0 auto;'
      }
      imgTag += ` style="${styleMap[alignment]}"`
    }
    
    imgTag += ' />'
    
    onInsert(imgTag)
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Insert Image</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Image URL *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Description of the image"
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Width</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g., 500px or 100%"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Height</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 300px or auto"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Alignment</label>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value as any)}
            >
              <option value="none">None</option>
              <option value="left">Float Left</option>
              <option value="center">Center</option>
              <option value="right">Float Right</option>
            </select>
          </div>
          
          {imageUrl && (
            <div className={styles.previewSection}>
              <label className={styles.label}>Preview:</label>
              <div className={styles.imagePreview}>
                <img 
                  src={imageUrl} 
                  alt={altText}
                  style={{
                    maxWidth: '100%',
                    width: width || 'auto',
                    height: height || 'auto',
                    ...(alignment === 'center' && { display: 'block', margin: '0 auto' }),
                    ...(alignment === 'left' && { float: 'left', marginRight: '1em' }),
                    ...(alignment === 'right' && { float: 'right', marginLeft: '1em' }),
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove(styles.hidden)
                  }}
                />
                <div className={`${styles.error} ${styles.insertImageResultHidden}`}>
                  Failed to load image
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button 
            onClick={handleInsert} 
            disabled={!imageUrl}
            className={styles.primaryButton}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  )
}