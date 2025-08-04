import { DiffLine, generateDiff } from './diff'

export interface ChangeGroup {
  id: string
  type: 'addition' | 'deletion' | 'modification'
  title: string
  description: string
  startLine: number
  endLine: number
  lines: DiffLine[]
  contextBefore: DiffLine[]
  contextAfter: DiffLine[]
  selected: boolean
}

function extractHeadingFromLines(lines: DiffLine[], startIdx: number): string | null {
  // Look backwards for the nearest heading
  for (let i = startIdx; i >= 0; i--) {
    const line = lines[i]
    if (line.type === 'unchanged' || line.type === 'removed') {
      const headingMatch = line.content.match(/^#+\s+(.+)$/)
      if (headingMatch) {
        return headingMatch[1].trim()
      }
    }
  }
  return null
}

function groupConsecutiveChanges(diffLines: DiffLine[]): ChangeGroup[] {
  const groups: ChangeGroup[] = []
  let currentGroup: DiffLine[] = []
  let groupType: 'addition' | 'deletion' | 'modification' | null = null
  let groupStartIdx = -1
  const contextLines = 3 // Number of context lines to show before and after
  
  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i]
    
    if (line.type === 'unchanged') {
      // If we have a current group, finalize it
      if (currentGroup.length > 0 && groupType) {
        const heading = extractHeadingFromLines(diffLines, groupStartIdx)
        const groupId = `group-${groups.length}`
        
        // Determine title and description
        let title = ''
        let description = ''
        
        if (heading) {
          title = `Changes in "${heading}"`
        } else {
          title = `Changes at lines ${currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0}-${
            currentGroup[currentGroup.length - 1].oldLineNumber || 
            currentGroup[currentGroup.length - 1].newLineNumber || 0
          }`
        }
        
        // Create description based on content
        const addedLines = currentGroup.filter(l => l.type === 'added').length
        const removedLines = currentGroup.filter(l => l.type === 'removed').length
        
        if (addedLines > 0 && removedLines > 0) {
          description = `Modified ${removedLines} lines, added ${addedLines} lines`
        } else if (addedLines > 0) {
          description = `Added ${addedLines} lines`
        } else if (removedLines > 0) {
          description = `Removed ${removedLines} lines`
        }
        
        // Get context lines
        const contextBefore: DiffLine[] = []
        const contextAfter: DiffLine[] = []
        
        // Get context before
        for (let j = Math.max(0, groupStartIdx - contextLines); j < groupStartIdx; j++) {
          if (diffLines[j].type === 'unchanged') {
            contextBefore.push(diffLines[j])
          }
        }
        
        // Get context after
        for (let j = i; j < Math.min(diffLines.length, i + contextLines); j++) {
          if (diffLines[j].type === 'unchanged') {
            contextAfter.push(diffLines[j])
          }
        }
        
        groups.push({
          id: groupId,
          type: groupType,
          title,
          description,
          startLine: currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0,
          endLine: currentGroup[currentGroup.length - 1].oldLineNumber || 
                   currentGroup[currentGroup.length - 1].newLineNumber || 0,
          lines: currentGroup,
          contextBefore,
          contextAfter,
          selected: true // Default to selected
        })
        
        currentGroup = []
        groupType = null
      }
    } else {
      // Start or continue a group
      if (currentGroup.length === 0) {
        groupStartIdx = i
        groupType = line.type === 'added' ? 'addition' : 'deletion'
      } else if (groupType === 'addition' && line.type === 'removed') {
        groupType = 'modification'
      } else if (groupType === 'deletion' && line.type === 'added') {
        groupType = 'modification'
      }
      
      currentGroup.push(line)
    }
  }
  
  // Handle any remaining group
  if (currentGroup.length > 0 && groupType) {
    const heading = extractHeadingFromLines(diffLines, groupStartIdx)
    const groupId = `group-${groups.length}`
    
    let title = ''
    let description = ''
    
    if (heading) {
      title = `Changes in "${heading}"`
    } else {
      title = `Changes at lines ${currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0}-${
        currentGroup[currentGroup.length - 1].oldLineNumber || 
        currentGroup[currentGroup.length - 1].newLineNumber || 0
      }`
    }
    
    const addedLines = currentGroup.filter(l => l.type === 'added').length
    const removedLines = currentGroup.filter(l => l.type === 'removed').length
    
    if (addedLines > 0 && removedLines > 0) {
      description = `Modified ${removedLines} lines, added ${addedLines} lines`
    } else if (addedLines > 0) {
      description = `Added ${addedLines} lines`
    } else if (removedLines > 0) {
      description = `Removed ${removedLines} lines`
    }
    
    // Get context lines for last group
    const contextBefore: DiffLine[] = []
    const contextAfter: DiffLine[] = []
    
    // Get context before
    for (let j = Math.max(0, groupStartIdx - contextLines); j < groupStartIdx; j++) {
      if (diffLines[j].type === 'unchanged') {
        contextBefore.push(diffLines[j])
      }
    }
    
    // Get context after (from end of group to end of diff)
    const groupEndIdx = diffLines.length
    for (let j = groupEndIdx; j < Math.min(diffLines.length, groupEndIdx + contextLines); j++) {
      if (j < diffLines.length && diffLines[j].type === 'unchanged') {
        contextAfter.push(diffLines[j])
      }
    }
    
    groups.push({
      id: groupId,
      type: groupType,
      title,
      description,
      startLine: currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0,
      endLine: currentGroup[currentGroup.length - 1].oldLineNumber || 
               currentGroup[currentGroup.length - 1].newLineNumber || 0,
      lines: currentGroup,
      contextBefore,
      contextAfter,
      selected: true
    })
  }
  
  return groups
}

export function identifyChangeGroups(baseContent: string, incomingContent: string): ChangeGroup[] {
  const diff = generateDiff(baseContent, incomingContent)
  return groupConsecutiveChanges(diff.lines)
}

export function applySelectedChanges(
  baseContent: string, 
  incomingContent: string, 
  selectedGroups: Set<string>
): string {
  const diff = generateDiff(baseContent, incomingContent)
  const groups = groupConsecutiveChanges(diff.lines)
  
  // const baseLines = baseContent.split('\n')
  const resultLines: string[] = []
  // let baseIndex = 0
  
  for (const line of diff.lines) {
    if (line.type === 'unchanged') {
      resultLines.push(line.content)
      // baseIndex++
    } else {
      // Find which group this line belongs to
      const group = groups.find(g => g.lines.includes(line))
      
      if (group && selectedGroups.has(group.id)) {
        // Apply this change
        if (line.type === 'added') {
          resultLines.push(line.content)
        } else if (line.type === 'removed') {
          // Skip this line (don't add to result)
          // baseIndex++
        }
      } else {
        // Don't apply this change
        if (line.type === 'removed') {
          // Keep the original line
          resultLines.push(line.content)
          // baseIndex++
        }
        // Skip additions if not selected
      }
    }
  }
  
  return resultLines.join('\n')
}