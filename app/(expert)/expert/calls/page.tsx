"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { mockBookings, mockCalls } from "@/lib/mock-data"
import { History, Calendar, Clock, Star, Video } from "lucide-react"

export default function ExpertCallsPage() {
  const upcomingBookings = mockBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const pastCalls = mockCalls

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Calls</h1>
            <p className="text-muted-foreground">Manage your upcoming and past consultations</p>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Past ({pastCalls.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled calls with clients</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={booking.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {booking.user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.user?.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(booking.slotStart).toLocaleDateString()} at{" "}
                              {new Date(booking.slotStart).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">{booking.user?.walletAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                            <p className="text-sm text-primary font-medium mt-1">₦{booking.cost}</p>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90">
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming calls scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Past Consultations</CardTitle>
                <CardDescription>Your completed calls and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                {pastCalls.length > 0 ? (
                  <div className="space-y-4">
                    {pastCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={call.booking?.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {call.booking?.user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{call.booking?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(call.startTime).toLocaleDateString()} • {call.durationMinutes} minutes
                            </p>
                            {call.review && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                &quot;{call.review}&quot;
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {call.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < call.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <div className="text-right">
                            <p className="font-semibold text-primary">₦{call.amountCharged}</p>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No past calls yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
