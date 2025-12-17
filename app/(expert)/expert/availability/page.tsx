"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Save, Loader2 } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return [`${hour}:00`, `${hour}:30`];
}).flat();

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [status, setStatus] = useState<string>("");
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Monday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    Tuesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    Wednesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    Thursday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    Friday: { enabled: false, startTime: "09:00", endTime: "15:00" },
    Saturday: { enabled: false, startTime: "10:00", endTime: "14:00" },
    Sunday: { enabled: false, startTime: "10:00", endTime: "14:00" },
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsFetching(true);
        const response = await fetch("/api/expert/profile");

        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to load availability",
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        setStatus(data.status);

        // Transform availability from DB format to component format
        if (data.availability && typeof data.availability === "object") {
          const newSchedule: Record<string, DaySchedule> = {};
          days.forEach((day) => {
            if (data.availability[day]) {
              newSchedule[day] = {
                enabled: true,
                startTime: data.availability[day].startTime,
                endTime: data.availability[day].endTime,
              };
            } else {
              newSchedule[day] = {
                enabled: false,
                startTime: "09:00",
                endTime: "17:00",
              };
            }
          });
          setSchedule(newSchedule);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAvailability();
  }, [toast]);

  const handleToggleDay = (day: string) => {
    if (status !== "approved") return;
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const handleTimeChange = (
    day: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (status !== "approved") return;
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (status !== "approved") return;
    setIsLoading(true);
    try {
      // Transform schedule to DB format (only enabled days)
      const availability: Record<
        string,
        { startTime: string; endTime: string }
      > = {};
      Object.entries(schedule).forEach(([day, daySchedule]) => {
        if (daySchedule.enabled) {
          availability[day] = {
            startTime: daySchedule.startTime,
            endTime: daySchedule.endTime,
          };
        }
      });

      const response = await fetch("/api/expert/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability: availability,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update availability");
      }

      toast({
        title: "Availability updated!",
        description: "Your schedule has been saved.",
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update availability",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToAll = (sourceDay: string) => {
    if (status !== "approved") return;
    const sourceSchedule = schedule[sourceDay];
    const newSchedule = { ...schedule };
    days.forEach((day) => {
      newSchedule[day] = { ...sourceSchedule };
    });
    setSchedule(newSchedule);
    toast({
      title: "Schedule copied",
      description: `${sourceDay}'s schedule applied to all days.`,
    });
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Availability</h1>
            <p className="text-muted-foreground">
              Set your weekly schedule for consultations
            </p>
          </div>
        </div>

        {status && status !== "approved" && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-500 font-medium">
              Your account is currently {status}. You must be approved to set
              your availability and receive bookings.
            </p>
          </div>
        )}

        <Card className="glass border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Define when you&apos;re available for calls. Clients can only book
              during these times.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-colors ${
                  schedule[day].enabled
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/20 border-border/50"
                } ${
                  status !== "approved" ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-32">
                  <Switch
                    checked={schedule[day].enabled}
                    onCheckedChange={() => handleToggleDay(day)}
                    disabled={status !== "approved"}
                  />
                  <span
                    className={`font-medium ${
                      !schedule[day].enabled && "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {schedule[day].enabled ? (
                  <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Select
                        value={schedule[day].startTime}
                        onValueChange={(v) =>
                          handleTimeChange(day, "startTime", v)
                        }
                        disabled={status !== "approved"}
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
                      <Select
                        value={schedule[day].endTime}
                        onValueChange={(v) =>
                          handleTimeChange(day, "endTime", v)
                        }
                        disabled={status !== "approved"}
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
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToAll(day)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      disabled={status !== "approved"}
                    >
                      Copy to all
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unavailable
                  </span>
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
                <p className="text-2xl font-bold text-primary">
                  {days.filter((d) => schedule[d].enabled).length}
                </p>
                <p className="text-sm text-muted-foreground">Days/week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">
                  {days.reduce((acc, day) => {
                    if (!schedule[day].enabled) return acc;
                    const start = Number.parseInt(
                      schedule[day].startTime.split(":")[0]
                    );
                    const end = Number.parseInt(
                      schedule[day].endTime.split(":")[0]
                    );
                    return acc + (end - start);
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Hours/week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 text-center">
                <p className="text-2xl font-bold text-primary">
                  {days.reduce((acc, day) => {
                    if (!schedule[day].enabled) return acc;
                    const start = Number.parseInt(
                      schedule[day].startTime.split(":")[0]
                    );
                    const end = Number.parseInt(
                      schedule[day].endTime.split(":")[0]
                    );
                    return acc + (end - start) * 3;
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
          <Button
            onClick={handleSave}
            disabled={isLoading || status !== "approved"}
            className="bg-primary hover:bg-primary/90 glow-primary"
          >
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
  );
}
