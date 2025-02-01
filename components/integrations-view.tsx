"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { SiGmail, SiSlack, SiZoom } from "react-icons/si"

export function IntegrationsView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SiGmail/>
              Gmail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 mb-4">
              Connect your Gmail account to enable AI-powered email management.
            </p>
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
              Connect Gmail
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <BiMicrosoft className="h-5 w-5 text-blue-400" /> */}
              Outlook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 mb-4">
              Connect your Outlook account for seamless email integration.
            </p>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SiSlack />
              Slack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 mb-4">
              Integrate with Slack for team collaboration features.
            </p>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}