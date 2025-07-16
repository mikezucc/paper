import { useState, useCallback, useRef } from 'react'

interface HistoryState {
  value: string
  selectionStart: number
  selectionEnd: number
}

export function useUndoRedo(initialValue: string, maxHistorySize = 50) {
  const [history, setHistory] = useState<HistoryState[]>([
    { value: initialValue, selectionStart: 0, selectionEnd: 0 }
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isInternalChange = useRef(false)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const addToHistory = useCallback((value: string, selectionStart: number, selectionEnd: number) => {
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }

    setHistory(prevHistory => {
      // Remove any history after current index (branching)
      const newHistory = prevHistory.slice(0, currentIndex + 1)
      
      // Add new state
      newHistory.push({ value, selectionStart, selectionEnd })
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
        return newHistory
      }
      
      return newHistory
    })
    
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1))
  }, [currentIndex, maxHistorySize])

  const undo = useCallback(() => {
    if (canUndo) {
      isInternalChange.current = true
      setCurrentIndex(prev => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [canUndo, currentIndex, history])

  const redo = useCallback(() => {
    if (canRedo) {
      isInternalChange.current = true
      setCurrentIndex(prev => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [canRedo, currentIndex, history])

  const reset = useCallback((value: string) => {
    setHistory([{ value, selectionStart: 0, selectionEnd: 0 }])
    setCurrentIndex(0)
  }, [])

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  }
}