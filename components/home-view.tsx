"use client"

import * as React from "react"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { formatDistanceToNow } from 'date-fns'
import { EmailDetailModal } from "./email-detail-modal"
import { PanelRightOpen } from "lucide-react"
import { Button } from "./ui/button"

export function HomeView() {
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recentEmails, setRecentEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8080/auth/emails', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setRecentEmails(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Failed to fetch emails:', error)
        setRecentEmails([])
      })
      .finally(() => setIsLoading(false))
  }, [])

  const formatEmailDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date unavailable'
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Date unavailable'
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 transition-[margin] duration-300 ${
      sidebarOpen ? 'ml-[250px]' : 'ml-0'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col space-y-2 p-8 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <PanelRightOpen className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {getGreeting()}
              </h1>
              <p className="text-sm text-zinc-400">Here are your recent emails</p>
            </div>
          </div>
        </div>
    
        <Card className="flex-1 bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader className="sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/5">
            <CardTitle className="text-white/80">Recent Emails</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-4 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                  </div>
                ) : recentEmails.length === 0 ? (
                  <p className="text-white/50 text-center py-8">No emails found</p>
                ) : (
                  recentEmails.map((email: any) => (
                    <div
                      key={email.id}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 
                        transition-colors border border-white/5 cursor-pointer"
                      onClick={() => {
                        setSelectedEmail(email)
                        setIsModalOpen(true)
                      }}
                    >
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-white/70">
                          {email.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm font-medium text-white/90">
                            {email.from.split('@')[0]}
                          </p>
                          <p className="text-xs text-white/50 whitespace-nowrap">
                            {formatEmailDate(email.date)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-white/80 mt-1 truncate">
                          {email.subject || '(No subject)'}
                        </p>
                        <p className="text-sm text-white/60 mt-1 line-clamp-1">
                          {email.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
    
        <EmailDetailModal
          email={selectedEmail}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEmail(null)
          }}
        />
      </div>
    </div>
  )
}