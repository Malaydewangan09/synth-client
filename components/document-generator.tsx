import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FileText, Wand2 } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function DocumentGenerator() {
  const [documentType, setDocumentType] = useState("")

  const templates = [
    { id: 'meeting', name: 'Meeting Minutes' },
    { id: 'proposal', name: 'Project Proposal' },
    { id: 'report', name: 'Progress Report' }
  ]

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/5">
      <CardHeader>
        <CardTitle className="text-white/80">AI Document Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white/90">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10">
              {templates.map(template => (
                <SelectItem 
                  key={template.id} 
                  value={template.id}
                  className="text-white/90"
                >
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button className="w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Document
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}