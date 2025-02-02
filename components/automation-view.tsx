"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Plus, Settings, Mail, Star, Import, Edit, MoreVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function AutomationView() {
  const [showNewLabelDialog, setShowNewLabelDialog] = React.useState(false)
  const [automations, setAutomations] = React.useState([
    {
      id: 1,
      name: "Investor Emails",
      description: "Automatically label and organize investor communications",
      enabled: true,
      conditions: ["from:*@investor.com", "subject:investment"],
      actions: ["Move to Investors", "Mark Important"]
    }
  ])

  return (
    <div className="p-6 space-y-8">
      {/* Remove font-sans since it's now the default */}
      <div className="space-y-2">
        <h1 className="text-2xl font-normal text-white/90">Email Automations</h1>
        <p className="text-sm font-normal text-white/60 leading-relaxed">
          Create smart rules to automatically organize your inbox and respond to emails
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => setShowNewLabelDialog(true)}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-normal"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
        <Button 
          variant="outline" 
          className="border-white/10 text-white/80 hover:bg-white/10 font-normal"
        >
          <Import className="w-4 h-4 mr-2" />
          Import Rules
        </Button>
      </div>

      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="bg-black/20 backdrop-blur-sm border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-normal text-white/90">{automation.name}</h3>
                    </div>
                    <Switch 
                      checked={automation.enabled}
                      onCheckedChange={(checked) => {
                        setAutomations(automations.map(a => 
                          a.id === automation.id ? {...a, enabled: checked} : a
                        ))
                      }}
                    />
                  </div>
                  
                  <p className="text-sm font-normal text-white/60 leading-relaxed">{automation.description}</p>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-normal text-white/70">Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {automation.conditions.map((condition, i) => (
                          <div key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs font-normal text-white/60">
                            {condition}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-normal text-white/70">Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {automation.actions.map((action, i) => (
                          <div key={i} className="px-2 py-1 rounded-md bg-purple-500/10 text-xs font-normal text-purple-200">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 ml-6">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog remains the same */}
    </div>
  )
}