import * as React from "react"
import { EmailInsights } from "./email-insights"
import { TaskExtractor } from "./task-extractor"
import { DocumentGenerator } from "./document-generator"
import { VoiceCommands } from "./voice-commands"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Brain, FileText, CheckCircle, Mic } from "lucide-react"

export function AIWorkspaceView() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-white/90">AI Workspace</h2>
      
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-500/20">
            <Brain className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-500/20">
            <CheckCircle className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-purple-500/20">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="voice" className="data-[state=active]:bg-purple-500/20">
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <EmailInsights />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskExtractor />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentGenerator />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceCommands />
        </TabsContent>
      </Tabs>
    </div>
  )
}