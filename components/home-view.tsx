"use client"

import * as React from "react"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Mail, Brain, Zap, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDistanceToNow } from 'date-fns'
import { ScrollArea } from "./ui/scroll-area"

// Add import at the top
import { EmailDetailModal } from "./email-detail-modal"

export function HomeView() {
  // Add these state declarations after the existing ones
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [stats, setStats] = useState({
    totalEmails: 0,
    aiAssisted: 0,
    automated: 0,
    avgResponseTime: '0min'
  })
  // Modify emailActivity state to include categories
  const [emailActivity, setEmailActivity] = useState([
    { date: '2024-01', personal: 15, work: 25, promotional: 10 },
    { date: '2024-02', personal: 20, work: 30, promotional: 8 },
    { date: '2024-03', personal: 25, work: 35, promotional: 12 },
  ])
  const [recentEmails, setRecentEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch stats
    fetch('http://localhost:8080/auth/stats', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)

    // Fetch emails
    fetch('http://localhost:8080/auth/emails', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array, otherwise use empty array
        setRecentEmails(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Failed to fetch emails:', error)
        setRecentEmails([]) // Set empty array on error
      })
      .finally(() => setIsLoading(false))
  }, [])

  const formatEmailDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Date unavailable'
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Date unavailable'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Total Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalEmails}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Assisted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.aiAssisted}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.automated}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modified Email Activity Chart */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-white/80">Email Activity by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emailActivity}>
                <XAxis dataKey="date" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#000000dd',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="work" 
                  stroke="#818cf8" 
                  strokeWidth={2}
                  name="Work"
                />
                <Line 
                  type="monotone" 
                  dataKey="personal" 
                  stroke="#34d399" 
                  strokeWidth={2}
                  name="Personal"
                />
                <Line 
                  type="monotone" 
                  dataKey="promotional" 
                  stroke="#fbbf24" 
                  strokeWidth={2}
                  name="Promotional"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modified Recent Emails with ScrollArea */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-white/80">Recent Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
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
      </div>

      {/* Add the modal */}
      <EmailDetailModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEmail(null)
        }}
      />
    </div>
  )
}