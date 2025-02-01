"use client"
import * as React from "react"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Brain, Calendar, Mail } from 'lucide-react'

export function MemoriesView() {
  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "Project Discussion",
      date: "2024-02-01",
      summary: "Discussion about the new AI features implementation",
      participants: ["john@example.com", "sarah@example.com"],
      category: "Work"
    },
    // More memories will be fetched from backend
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {memories.map((memory) => (
          <Card key={memory.id} className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  {memory.title}
                </div>
                <span className="text-sm text-white/60">
                  {new Date(memory.date).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">{memory.summary}</p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4" />
                {memory.participants.join(", ")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}