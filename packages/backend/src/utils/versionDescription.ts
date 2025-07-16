import { generateDiff } from './diff'

interface ContentStats {
  wordCount: number
  lineCount: number
  paragraphCount: number
  headingCount: number
  codeBlockCount: number
  linkCount: number
  imageCount: number
}

function getContentStats(content: string): ContentStats {
  const lines = content.split('\n')
  const words = content.match(/\b\w+\b/g) || []
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim())
  const headings = content.match(/^#+\s+.+$/gm) || []
  const codeBlocks = content.match(/```[\s\S]*?```/g) || []
  const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
  const images = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []

  return {
    wordCount: words.length,
    lineCount: lines.length,
    paragraphCount: paragraphs.length,
    headingCount: headings.length,
    codeBlockCount: codeBlocks.length,
    linkCount: links.length,
    imageCount: images.length
  }
}

function getSignificantChanges(oldStats: ContentStats, newStats: ContentStats): string[] {
  const changes: string[] = []
  
  const wordDiff = newStats.wordCount - oldStats.wordCount
  if (Math.abs(wordDiff) > 50) {
    if (wordDiff > 0) {
      changes.push(`Added ~${wordDiff} words`)
    } else {
      changes.push(`Removed ~${Math.abs(wordDiff)} words`)
    }
  }

  const headingDiff = newStats.headingCount - oldStats.headingCount
  if (headingDiff > 0) {
    changes.push(`Added ${headingDiff} heading${headingDiff > 1 ? 's' : ''}`)
  } else if (headingDiff < 0) {
    changes.push(`Removed ${Math.abs(headingDiff)} heading${Math.abs(headingDiff) > 1 ? 's' : ''}`)
  }

  const codeDiff = newStats.codeBlockCount - oldStats.codeBlockCount
  if (codeDiff > 0) {
    changes.push(`Added ${codeDiff} code block${codeDiff > 1 ? 's' : ''}`)
  } else if (codeDiff < 0) {
    changes.push(`Removed ${Math.abs(codeDiff)} code block${Math.abs(codeDiff) > 1 ? 's' : ''}`)
  }

  const imageDiff = newStats.imageCount - oldStats.imageCount
  if (imageDiff > 0) {
    changes.push(`Added ${imageDiff} image${imageDiff > 1 ? 's' : ''}`)
  } else if (imageDiff < 0) {
    changes.push(`Removed ${Math.abs(imageDiff)} image${Math.abs(imageDiff) > 1 ? 's' : ''}`)
  }

  return changes
}

function analyzeSectionChanges(oldContent: string, newContent: string): string[] {
  const oldHeadings = oldContent.match(/^#+\s+(.+)$/gm) || []
  const newHeadings = newContent.match(/^#+\s+(.+)$/gm) || []
  
  const oldHeadingTexts = oldHeadings.map(h => h.replace(/^#+\s+/, '').trim())
  const newHeadingTexts = newHeadings.map(h => h.replace(/^#+\s+/, '').trim())
  
  const changes: string[] = []
  
  // Find new sections
  const addedSections = newHeadingTexts.filter(h => !oldHeadingTexts.includes(h))
  if (addedSections.length > 0) {
    if (addedSections.length === 1) {
      changes.push(`Added section "${addedSections[0]}"`)
    } else if (addedSections.length <= 3) {
      changes.push(`Added sections: ${addedSections.map(s => `"${s}"`).join(', ')}`)
    } else {
      changes.push(`Added ${addedSections.length} new sections`)
    }
  }
  
  // Find removed sections
  const removedSections = oldHeadingTexts.filter(h => !newHeadingTexts.includes(h))
  if (removedSections.length > 0) {
    if (removedSections.length === 1) {
      changes.push(`Removed section "${removedSections[0]}"`)
    } else if (removedSections.length <= 3) {
      changes.push(`Removed sections: ${removedSections.map(s => `"${s}"`).join(', ')}`)
    } else {
      changes.push(`Removed ${removedSections.length} sections`)
    }
  }
  
  return changes
}

export function generateVersionDescription(
  oldContent: string | null, 
  newContent: string | null,
  oldTitle?: string,
  newTitle?: string,
  oldAbstract?: string,
  newAbstract?: string
): string {
  // Handle initial version
  if (!oldContent && newContent) {
    return 'Initial version'
  }

  // Handle deletion
  if (oldContent && !newContent) {
    return 'Content removed'
  }

  // Handle no content change
  if (oldContent === newContent && oldTitle === newTitle && oldAbstract === newAbstract) {
    return 'No changes'
  }

  const changes: string[] = []

  // Check title change
  if (oldTitle && newTitle && oldTitle !== newTitle) {
    changes.push('Updated title')
  }

  // Check abstract change
  if (oldAbstract && newAbstract && oldAbstract !== newAbstract) {
    const oldWords = (oldAbstract.match(/\b\w+\b/g) || []).length
    const newWords = (newAbstract.match(/\b\w+\b/g) || []).length
    if (Math.abs(newWords - oldWords) > 10) {
      changes.push('Revised abstract')
    } else {
      changes.push('Minor abstract edits')
    }
  }

  // Analyze content changes
  if (oldContent && newContent && oldContent !== newContent) {
    const oldStats = getContentStats(oldContent)
    const newStats = getContentStats(newContent)
    
    // Get significant stat changes
    const statChanges = getSignificantChanges(oldStats, newStats)
    changes.push(...statChanges)
    
    // Analyze section changes
    const sectionChanges = analyzeSectionChanges(oldContent, newContent)
    changes.push(...sectionChanges)
    
    // If no significant changes detected, use generic description
    if (changes.length === 0 || (changes.length === 1 && (changes[0] === 'Updated title' || changes[0] === 'Minor abstract edits'))) {
      const diff = generateDiff(oldContent, newContent)
      if (diff.additions > 0 || diff.deletions > 0) {
        if (diff.additions > diff.deletions * 2) {
          changes.push('Expanded content')
        } else if (diff.deletions > diff.additions * 2) {
          changes.push('Condensed content')
        } else {
          changes.push('Revised content')
        }
      }
    }
  }

  // Combine changes into description
  if (changes.length === 0) {
    return 'Minor edits'
  } else if (changes.length === 1) {
    return changes[0]
  } else if (changes.length === 2) {
    return changes.join(' and ')
  } else {
    // Take the most significant changes
    return changes.slice(0, 3).join(', ')
  }
}

// Simple diff implementation for the backend
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
}

interface DiffResult {
  lines: DiffLine[]
  additions: number
  deletions: number
  unchanged: number
}

function generateDiff(oldText: string, newText: string): DiffResult {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  
  // Simple line-based diff (not as sophisticated as the frontend version)
  let additions = 0
  let deletions = 0
  let unchanged = 0
  
  const oldSet = new Set(oldLines)
  const newSet = new Set(newLines)
  
  for (const line of oldLines) {
    if (!newSet.has(line)) {
      deletions++
    } else {
      unchanged++
    }
  }
  
  for (const line of newLines) {
    if (!oldSet.has(line)) {
      additions++
    }
  }
  
  return {
    lines: [],
    additions,
    deletions,
    unchanged: Math.min(unchanged, newLines.length - additions)
  }
}