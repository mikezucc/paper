import React, { createContext, useContext } from 'react'

interface SSRContextType {
  paperData?: any
  isSSR: boolean
}

const SSRContext = createContext<SSRContextType>({ isSSR: false })

export function SSRProvider({ children, paperData }: { children: React.ReactNode; paperData?: any }) {
  return (
    <SSRContext.Provider value={{ paperData, isSSR: !!paperData }}>
      {children}
    </SSRContext.Provider>
  )
}

export function useSSR() {
  return useContext(SSRContext)
}