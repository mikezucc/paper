export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNumber?: number
  oldLineNumber?: number
  newLineNumber?: number
}

export interface DiffResult {
  lines: DiffLine[]
  additions: number
  deletions: number
  unchanged: number
}

function splitIntoLines(text: string): string[] {
  return text.split('\n')
}

function computeLCS(lines1: string[], lines2: string[]): number[][] {
  const m = lines1.length
  const n = lines2.length
  const lcs: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
      }
    }
  }

  return lcs
}

export function generateDiff(oldText: string, newText: string): DiffResult {
  const oldLines = splitIntoLines(oldText)
  const newLines = splitIntoLines(newText)
  const lcs = computeLCS(oldLines, newLines)
  
  const diffLines: DiffLine[] = []
  let additions = 0
  let deletions = 0
  let unchanged = 0
  
  let i = oldLines.length
  let j = newLines.length
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diffLines.unshift({
        type: 'unchanged',
        content: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j
      })
      unchanged++
      i--
      j--
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'added',
        content: newLines[j - 1],
        newLineNumber: j
      })
      additions++
      j--
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'removed',
        content: oldLines[i - 1],
        oldLineNumber: i
      })
      deletions++
      i--
    }
  }
  
  return {
    lines: diffLines,
    additions,
    deletions,
    unchanged
  }
}

export function generateUnifiedDiff(oldText: string, newText: string, contextLines: number = 3): string {
  const diff = generateDiff(oldText, newText)
  const lines = diff.lines
  const output: string[] = []
  
  let i = 0
  while (i < lines.length) {
    if (lines[i].type === 'unchanged') {
      i++
      continue
    }
    
    const hunkStart = Math.max(0, i - contextLines)
    let hunkEnd = i
    
    while (hunkEnd < lines.length && (
      lines[hunkEnd].type !== 'unchanged' || 
      (hunkEnd < lines.length - 1 && hunkEnd - i < contextLines * 2 && lines[hunkEnd + 1].type !== 'unchanged')
    )) {
      hunkEnd++
    }
    
    hunkEnd = Math.min(lines.length, hunkEnd + contextLines)
    
    const oldStart = lines[hunkStart].oldLineNumber || 1
    const oldCount = lines.slice(hunkStart, hunkEnd).filter(l => l.type !== 'added').length
    const newStart = lines[hunkStart].newLineNumber || 1
    const newCount = lines.slice(hunkStart, hunkEnd).filter(l => l.type !== 'removed').length
    
    output.push(`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`)
    
    for (let j = hunkStart; j < hunkEnd; j++) {
      const line = lines[j]
      let prefix = ' '
      if (line.type === 'added') prefix = '+'
      else if (line.type === 'removed') prefix = '-'
      output.push(prefix + line.content)
    }
    
    i = hunkEnd
  }
  
  return output.join('\n')
}

export function generateSideBySideDiff(oldText: string, newText: string): { left: DiffLine[], right: DiffLine[] } {
  const diff = generateDiff(oldText, newText)
  const left: DiffLine[] = []
  const right: DiffLine[] = []
  
  for (const line of diff.lines) {
    if (line.type === 'unchanged') {
      left.push(line)
      right.push(line)
    } else if (line.type === 'removed') {
      left.push(line)
      right.push({ type: 'unchanged', content: '', lineNumber: undefined })
    } else if (line.type === 'added') {
      left.push({ type: 'unchanged', content: '', lineNumber: undefined })
      right.push(line)
    }
  }
  
  return { left, right }
}