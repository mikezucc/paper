import styles from '../styles/components.module.css'

interface ViewToggleProps {
  view: 'list' | 'grid'
  onViewChange: (view: 'list' | 'grid') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.viewToggleButton} ${view === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1zm0 3h12v1H2v-1z" />
        </svg>
        <span>List</span>
      </button>
      <button
        className={`${styles.viewToggleButton} ${view === 'grid' ? styles.active : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zm-7 7h5v5H2V9zm7 0h5v5H9V9z" />
        </svg>
        <span>Grid</span>
      </button>
    </div>
  )
}