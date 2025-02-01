"use client"

import * as React from "react"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Mail, Brain, Zap, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDistanceToNow } from 'date-fns'

export function HomeView() {
  const [stats, setStats] = useState({
    totalEmails: 0,
    aiAssisted: 0,
    automated: 0,
    avgResponseTime: '0min'
  })
  const [emailActivity, setEmailActivity] = useState([])
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
      .then(setRecentEmails)
      .catch(console.error)
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
        {/* Email Activity Chart */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-white/80">Email Activity</CardTitle>
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
                  dataKey="count" 
                  stroke="#818cf8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Emails */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-white/80">Recent Emails</CardTitle>
          </CardHeader>
          <CardContent>
  <div className="space-y-4">
    {isLoading ? (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    ) : recentEmails.length === 0 ? (
      <p className="text-white/50 text-center py-8">No emails found</p>
    ) : (
      recentEmails.slice(0, 5).map((email: any) => (
        <div
          key={email.id}
          className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
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
</CardContent>
        </Card>
      </div>
    </div>
  )
}