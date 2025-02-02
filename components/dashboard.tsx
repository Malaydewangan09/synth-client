"use client"

import { useState, useEffect } from 'react'
import { HomeView } from './home-view'
import { IntegrationsView } from './integrations-view'
import { MemoriesView } from './memories-view'
import { AutomationView } from './automation-view'
import { SettingsView } from './settings-view'
import { Sidebar } from './sidebar'
import { CalendarView } from './calendar-view'
import { AIChatView } from './ai-chat-view'
import { AIWorkspaceView } from './ai-workspace-view'
import { Brain, Home, Settings, Calendar, MessageSquare, Zap, Box, Database, Loader2 } from 'lucide-react'
import { useAI } from '@/contexts/ai-context'
import { toast } from 'sonner'

export function Dashboard() {
  const [currentView, setCurrentView] = useState('home')
  const [userEmail, setUserEmail] = useState('')
  const { isProcessing, setIsProcessing } = useAI()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:8080/auth/user', {
          credentials: 'include',
        })
        if (response.ok) {
          const email = await response.json()
          setUserEmail(email)
        } else {
          toast.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error)
        toast.error('Network error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserEmail()
  }, [])

  const handleViewChange = (view: string) => {
    setIsProcessing(true)
    setCurrentView(view)
    setTimeout(() => setIsProcessing(false), 500)
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />
      case 'integrations':
        return <IntegrationsView />
      case 'memories':
        return <MemoriesView />
      case 'automation':
        return <AutomationView />
      case 'settings':
        return <SettingsView />
      case 'calendar':
        return <CalendarView />
      case 'ai-chat':
        return <AIChatView />
      case 'ai-workspace':
        return <AIWorkspaceView />
      default:
        return <HomeView />
    }
  }

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      description: 'Dashboard overview'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Schedule and manage events'
    },
    {
      id: 'ai-chat',
      label: 'AI Chat',
      icon: MessageSquare,
      description: 'Chat with AI assistant'
    },
    {
      id: 'ai-workspace',
      label: 'AI Workspace',
      icon: Brain,
      description: 'AI-powered productivity tools'
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      description: 'Automate your workflows'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Box,
      description: 'Manage your integrations'
    },
    {
      id: 'memories',
      label: 'Memories',
      icon: Database,
      description: 'Your saved content'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Customize your workspace'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-black to-gray-900">
      <Sidebar 
        selectedView={currentView}
        setCurrentView={handleViewChange}
        items={navigationItems}
        userEmail={userEmail}
        isProcessing={isProcessing}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}