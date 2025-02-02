import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Brain, Heart, AlertTriangle, ThumbsUp } from "lucide-react"

export function EmailInsights() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/5">
      <CardHeader>
        <CardTitle className="text-white/80">Email Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <h3 className="text-sm text-green-200">Positive Interactions</h3>
            </div>
            <p className="text-2xl font-bold text-green-300 mt-2">75%</p>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm text-blue-200">Response Rate</h3>
            </div>
            <p className="text-2xl font-bold text-blue-300 mt-2">92%</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm text-purple-200">Client Satisfaction</h3>
            </div>
            <p className="text-2xl font-bold text-purple-300 mt-2">4.8/5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}