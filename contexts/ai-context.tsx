"use client"

import React, { createContext, useContext, useState } from 'react'

type AIContextType = {
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  lastCommand: string
  setLastCommand: (command: string) => void
  transcripts: string[]
  addTranscript: (text: string) => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const [transcripts, setTranscripts] = useState<string[]>([])

  const addTranscript = (text: string) => {
    setTranscripts(prev => [...prev, text])
  }

  return (
    <AIContext.Provider 
      value={{
        isProcessing,
        setIsProcessing,
        lastCommand,
        setLastCommand,
        transcripts,
        addTranscript
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}