"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Bell, Shield, Moon, Globe, Key } from 'lucide-react'

export function SettingsView() {
  console.log("herere")
  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-white/60">Get notified about important emails</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>AI Suggestions</Label>
              <p className="text-sm text-white/60">Receive AI-powered email suggestions</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Data Collection</Label>
              <p className="text-sm text-white/60">Allow data collection for better AI</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Analytics</Label>
              <p className="text-sm text-white/60">Track email performance metrics</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-400" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>OpenAI API Key</Label>
            <div className="flex gap-2 mt-2">
              <Input type="password" placeholder="Enter your OpenAI API key" />
              <Button>Save</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-400" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Preferred Language</Label>
            <select className="bg-black/40 border border-white/10 rounded-md p-2">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Time Zone</Label>
            <select className="bg-black/40 border border-white/10 rounded-md p-2">
              <option>UTC (GMT+0)</option>
              <option>EST (GMT-5)</option>
              <option>PST (GMT-8)</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}