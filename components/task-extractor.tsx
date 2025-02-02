import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export function TaskExtractor() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review proposal by Friday", priority: "high", deadline: "2024-03-20" },
    { id: 2, text: "Schedule team meeting", priority: "medium", deadline: "2024-03-18" }
  ])

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/5">
      <CardHeader>
        <CardTitle className="text-white/80">AI-Extracted Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`p-4 rounded-lg border transition-all ${
                task.priority === 'high' 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-blue-500/10 border-blue-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-white/80">{task.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/60">{task.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}