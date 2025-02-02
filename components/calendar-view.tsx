"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarClock, Users, Video } from "lucide-react"
import { InlineWidget } from "react-calendly";

// Add new imports
import { Bot, FileText, BarChart2, Brain, Sparkles, Clock, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"

export function CalendarView() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState([
    { id: 1, title: "Team Meeting", date: new Date(), time: "10:00 AM", description: "Weekly sync" },
    { id: 2, title: "Client Call", date: new Date(), time: "2:00 PM", description: "Project review" },
  ])
  const [showAddEventModal, setShowAddEventModal] = React.useState(false)
  const [newEvent, setNewEvent] = React.useState({ title: "", time: "", description: "" })
  const [meetingType, setMeetingType] = React.useState<string>("")
  const [attendees, setAttendees] = React.useState<string>("")
  const [duration, setDuration] = React.useState<string>("30")

  const scrollToEvent = (eventId: number) => {
    const element = document.getElementById(`event-${eventId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const meetingPlatforms = [
    { id: 'gmeet', name: 'Google Meet', icon: Video },
    { id: 'zoom', name: 'Zoom', icon: Video },
    { id: 'teams', name: 'Microsoft Teams', icon: Video },
  ]

  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
  ]

  const addEvent = () => {
    if (newEvent.title && newEvent.time) {
      const eventWithMeeting = {
        id: events.length + 1,
        date: date || new Date(),
        ...newEvent,
        meetingType,
        attendees: attendees.split(',').map(email => email.trim()),
        duration,
        meetingUrl: meetingType ? `https://${meetingType}.example.com/meeting-${Date.now()}` : undefined
      }
      setEvents([...events, eventWithMeeting])
      setShowAddEventModal(false)
      setNewEvent({ title: "", time: "", description: "" })
      setMeetingType("")
      setAttendees("")
      setDuration("30")
    }
  }

  const [showCalendly, setShowCalendly] = React.useState(false)
  const [meetingSummaries, setMeetingSummaries] = React.useState<Record<string, string>>({})
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false)
  const [suggestedTimes, setSuggestedTimes] = React.useState<Array<{ time: string; score: number }>>([])
  const [showAnalytics, setShowAnalytics] = React.useState(false)

  const meetingTemplates = [
    {
      id: 'standup',
      title: 'Daily Standup',
      duration: '15',
      description: 'Quick team sync to discuss progress and blockers',
      type: 'recurring'
    },
    {
      id: '1on1',
      title: '1:1 Meeting',
      duration: '30',
      description: 'Personal catch-up and feedback session',
      type: 'single'
    },
    {
      id: 'review',
      title: 'Project Review',
      duration: '45',
      description: 'Review project progress and discuss next steps',
      type: 'single'
    }
  ]

  const generateMeetingSummary = async (event: any) => {
    setIsGeneratingSummary(true)
    try {
      // Mock AI summary generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      const summary = `AI-generated summary for ${event.title}:\n` +
        `• Meeting scheduled for ${event.time}\n` +
        `• ${event.attendees?.length || 0} participants\n` +
        `• Key points to discuss: ${event.description}`
      
      setMeetingSummaries(prev => ({
        ...prev,
        [event.id]: summary
      }))
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const suggestMeetingTimes = async () => {
    // Mock time suggestion algorithm
    const times = [
      { time: "10:00 AM", score: 0.95 },
      { time: "2:00 PM", score: 0.85 },
      { time: "4:00 PM", score: 0.75 }
    ]
    setSuggestedTimes(times)
  }

  React.useEffect(() => {
    suggestMeetingTimes()
  }, [date])

  const getAnalytics = () => ({
    totalMeetings: events.length,
    totalDuration: events.reduce((acc, event) => acc + parseInt(event.duration || "0"), 0),
    platformStats: events.reduce((acc, event) => ({
      ...acc,
      [event.meetingType || 'other']: (acc[event.meetingType || 'other'] || 0) + 1
    }), {} as Record<string, number>),
    busyHours: "10 AM - 2 PM",
    upcomingCount: events.filter(e => new Date(e.date) > new Date()).length
  })

  return (
    <div className="h-screen overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white/90">Calendar</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCalendly(true)}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
            >
              <CalendarClock className="w-4 h-4 mr-2" />
              Schedule with Calendly
            </Button>
            <Button 
              onClick={() => setShowAddEventModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Calendly Dialog */}
        <Dialog open={showCalendly} onOpenChange={setShowCalendly}>
          <DialogContent className="max-w-3xl bg-black/90 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white/90">Schedule Meeting via Calendly</DialogTitle>
            </DialogHeader>
            <div className="h-[600px] bg-white rounded-lg overflow-hidden">
              <InlineWidget 
                url="https://calendly.com/malaydewangan310"
                styles={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="h-[calc(100vh-8rem)]">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-500/20">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="calendar" 
            className="mt-4 h-[calc(100%-3rem)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Calendar Card */}
              <Card className="bg-black/20 backdrop-blur-sm border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white/80">
                    <CalendarIcon className="h-5 w-5 text-purple-400/80" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border border-white/5"
                  />
                </CardContent>
              </Card>

              {/* Events Card */}
              <Card className="bg-black/20 backdrop-blur-sm border-white/5 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-white/80">
                    Events for {date?.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                  <div className="space-y-3">
                    {/* Suggested Times Section */}
                    {suggestedTimes.length > 0 && (
                      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4 sticky top-0 z-10 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Suggested Meeting Times
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestedTimes.map((slot, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="border-purple-500/20 hover:bg-purple-500/20"
                              onClick={() => setNewEvent(prev => ({ ...prev, time: slot.time }))}
                            >
                              {slot.time}
                              <span className="ml-2 text-xs opacity-50">
                                {Math.round(slot.score * 100)}%
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Events List */}
                    <AnimatePresence mode="popLayout">
                      {events
                        .filter(event => event.date.toDateString() === (date || new Date()).toDateString())
                        .map((event) => (
                          <motion.div
                            key={event.id}
                            id={`event-${event.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-medium text-white/90">{event.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <CalendarClock className="w-4 h-4 text-purple-400/80" />
                                  <p className="text-sm text-white/50">
                                    {event.time} ({event.duration}min)
                                  </p>
                                </div>
                                {event.meetingType && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Video className="w-4 h-4 text-blue-400/80" />
                                    <p className="text-sm text-white/50">
                                      {event.meetingType} Meeting
                                    </p>
                                  </div>
                                )}
                                {event.attendees?.length > 0 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Users className="w-4 h-4 text-green-400/80" />
                                    <p className="text-sm text-white/50">
                                      {event.attendees.length} attendees
                                    </p>
                                  </div>
                                )}
                                {event.description && (
                                  <p className="text-sm text-white/50 mt-2">
                                    {event.description}
                                  </p>
                                )}
                                {meetingSummaries[event.id] && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-3 p-3 rounded-md bg-purple-500/10 border border-purple-500/20"
                                  >
                                    <p className="text-sm text-white/70 whitespace-pre-line">
                                      {meetingSummaries[event.id]}
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => generateMeetingSummary(event)}
                                disabled={isGeneratingSummary}
                                className="text-purple-400 hover:text-purple-300"
                              >
                                {isGeneratingSummary ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Sparkles className="w-4 h-4" />
                                  </motion.div>
                                ) : (
                                  <Bot className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent 
            value="analytics"
            className="h-[calc(100%-3rem)] mt-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20"
          >
            <Card className="bg-black/20 backdrop-blur-sm border-white/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Analytics content here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}