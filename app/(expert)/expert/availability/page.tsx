"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, Save, Loader2 } from "lucide-react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return [`${hour}:00`, `${hour}:30`]
}).flat()

interface DaySchedule {
  enabled: boolean
  startTime: string
  endTime: string
}

export default function AvailabilityPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    Tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    Wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    Thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    Friday: { enabled: true, startTime: "09:00", endTime: "15:00" },
    Saturday: { enabled: false, startTime: "10:00", endTime: "14:00" },
    Sunday: { enabled: false, startTime: "10:00", endTime: "14:00" },
  })

  const handleToggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }))
  }

  const handleTimeChange = (day: string, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Availability updated!",
      description: "Your schedule has been saved.",
    })
  }

  const handleCopyToAll = (sourceDay: string) => {
    const sourceSchedule = schedule[sourceDay]
    const newSchedule = { ...schedule }
    days.forEach((day) => {
      newSchedule[day] = { ...sourceSchedule }
    })
    setSchedule(newSchedule)
    toast({
      title: "Schedule copied",
      description: `${sourceDay}'s schedule applied to all days.`,
    })
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Availability</h1>
            <p className="text-muted-foreground">Set your weekly schedule for consultations</p>
          </div>
        </div>

        <Card className="glass border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Define when you&apos;re available for calls. Clients can only book during these times.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-colors ${
                  schedule[day].enabled ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                }`}
              >
                <div className="flex items-center gap-4 min-w-32">
                  <Switch checked={schedule[day].enabled} onCheckedChange={() => handleToggleDay(day)} />
                  <span className={`font-medium ${!schedule[day].enabled && "text-muted-foreground"}`}>{day}</span>
                </div>

                {schedule[day].enabled ? (
                  <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Select
                        value={schedule[day].startTime}
                        onValueChange={(v) => handleTimeChange(day, "startTime", v)}
                      >
                        <SelectTrigger className="w-28 bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select value={schedule[day].endTime} onValueChange={(v) => handleTimeChange(day, "endTime", v)}>
                        <SelectTrigger className="w-28 bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToAll(day)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Copy to all
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="glass border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">{days.filter((d) => schedule[d].enabled).length}</p>
                <p className="text-sm text-muted-foreground">Days/week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">
                  {days.reduce((acc, day) => {
                    if (!schedule[day].enabled) return acc
                    const start = Number.parseInt(schedule[day].startTime.split(":")[0])
                    const end = Number.parseInt(schedule[day].endTime.split(":")[0])
                    return acc + (end - start)
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Hours/week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">
                  {days.reduce((acc, day) => {
                    if (!schedule[day].enabled) return acc
                    const start = Number.parseInt(schedule[day].startTime.split(":")[0])
                    const end = Number.parseInt(schedule[day].endTime.split(":")[0])
                    return acc + (end - start) * 3
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Max calls/week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">20</p>
                <p className="text-sm text-muted-foreground">Min/call</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="bg-primary hover:bg-primary/90 glow-primary">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
