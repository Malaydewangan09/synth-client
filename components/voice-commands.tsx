import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Mic, MicOff, Command } from "lucide-react"
import { Button } from "./ui/button"

export function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  const commands = [
    { phrase: "create email", action: "Opens email composer" },
    { phrase: "schedule meeting", action: "Opens calendar" },
    { phrase: "summarize inbox", action: "Shows email summary" }
  ]

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/5">
      <CardHeader>
        <CardTitle className="text-white/80">Voice Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            className={`w-full ${
              isListening 
                ? 'bg-red-500/20 hover:bg-red-500/30' 
                : 'bg-purple-500/20 hover:bg-purple-500/30'
            }`}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 mr-2" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>

          <div className="space-y-2">
            {commands.map((command, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Command className="w-4 h-4 text-purple-400" />
                    <span className="text-white/80">{command.phrase}</span>
                  </div>
                  <span className="text-sm text-white/60">{command.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}