"use client"

import { useState, useEffect } from 'react'
import { HomeView } from './home-view'
import { IntegrationsView } from './integrations-view'
import { MemoriesView } from './memories-view'
import { AutomationView } from './automation-view'
import { SettingsView } from './settings-view'
import { Sidebar } from './sidebar'
import { CalendarView } from './calendar-view'
// Add import
import { AIChatView } from './ai-chat-view'

export function Dashboard() {
  const [currentView, setCurrentView] = useState('home')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/user', {
          credentials: 'include',
        })
        if (response.ok) {
          const email = await response.json()
          setUserEmail(email)
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error)
      }
    }
    fetchUserEmail()
  }, [])

  const handleViewChange = (view: string) => {
    console.log('Changing view to:', view)
    setCurrentView(view)
  }

  // In your renderView function or similar
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
      default:
        return <HomeView />
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar onViewChange={handleViewChange} userEmail={userEmail} />
      <main className="flex-1 overflow-auto p-8">
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