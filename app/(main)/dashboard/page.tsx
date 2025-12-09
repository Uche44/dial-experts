"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { mockBookings, mockCalls } from "@/lib/mock-data"
import { Calendar, Clock, Video, History, Search, ArrowRight } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const userBookings = mockBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const userCalls = mockCalls.slice(0, 3)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1">Manage your consultations and track your activity.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 glow-primary">
            <Link href="/experts">
              <Search className="mr-2 w-4 h-4" />
              Find an Expert
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCalls.length}</p>
                  <p className="text-sm text-muted-foreground">Past Consultations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCalls.reduce((acc, c) => acc + c.durationMinutes, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Calls */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Consultations
              </CardTitle>
              <CardDescription>Your scheduled sessions with experts</CardDescription>
            </CardHeader>
            <CardContent>
              {userBookings.length > 0 ? (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={booking.expert?.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {booking.expert?.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.expert?.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.slotStart).toLocaleDateString()} at{" "}
                            {new Date(booking.slotStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                        <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                          <Link href={`/call/${booking.id}`}>Join</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming consultations</p>
                  <Button asChild variant="outline">
                    <Link href="/experts">Find an Expert</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-accent" />
                  Recent Activity
                </CardTitle>
                <Button variant="link" asChild className="text-primary">
                  <Link href="/history">
                    View All
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Your past consultations and payments</CardDescription>
            </CardHeader>
            <CardContent>
              {userCalls.length > 0 ? (
                <div className="space-y-4">
                  {userCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={call.booking?.expert?.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {call.booking?.expert?.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{call.booking?.expert?.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {call.durationMinutes} min • ₦{call.amountCharged}
                          </p>
                        </div>
                      </div>
                      {call.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(call.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No past consultations yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
