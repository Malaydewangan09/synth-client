"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function CalendarView() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState([
    { id: 1, title: "Team Meeting", date: new Date(), time: "10:00 AM", description: "Weekly sync" },
    { id: 2, title: "Client Call", date: new Date(), time: "2:00 PM", description: "Project review" },
  ])
  const [showAddEventModal, setShowAddEventModal] = React.useState(false)
  const [newEvent, setNewEvent] = React.useState({ title: "", time: "", description: "" })

  const addEvent = () => {
    if (newEvent.title && newEvent.time) {
      setEvents([...events, { id: events.length + 1, date: date || new Date(), ...newEvent }])
      setShowAddEventModal(false)
      setNewEvent({ title: "", time: "", description: "" })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white/90">Calendar</h2>
        <Button 
          onClick={() => setShowAddEventModal(true)}
          className="bg-white/10 hover:bg-white/20 text-white/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card className="bg-black/20 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-white/80">
              Events for {date?.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(event => event.date.toDateString() === (date || new Date()).toDateString())
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white/90">{event.title}</h3>
                        <p className="text-sm text-white/50 mt-1">{event.time}</p>
                        {event.description && (
                          <p className="text-sm text-white/50 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white/90">Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="title" className="text-white/70">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white/90"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-white/70">Time</Label>
              <Input
                id="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g., 10:00 AM"
                className="bg-white/5 border-white/10 text-white/90"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white/70">Description (optional)</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white/90"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddEventModal(false)}
                className="border-white/10 text-white/70 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={addEvent}
                className="bg-white/10 hover:bg-white/20 text-white/90"
              >
                Add Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}