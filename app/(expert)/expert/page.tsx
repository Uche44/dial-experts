"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { mockExperts, mockBookings, mockCalls } from "@/lib/mock-data"
import { Video, DollarSign, Star, Clock, TrendingUp, Calendar, ArrowRight } from "lucide-react"

export default function ExpertDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // useEffect(() => {
  //   if (!isLoading && (!isAuthenticated || user?.role !== "expert")) {
  //     router.push("/login?role=expert")
  //   }
  // }, [isAuthenticated, isLoading, user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Get expert data
  const expert = mockExperts[0]
  const upcomingBookings = mockBookings.filter((b) => b.status === "confirmed")
  const recentCalls = mockCalls.slice(0, 5)

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome, <span className="gradient-text">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1">Here&apos;s your activity overview</p>
          </div>
          <Badge variant={expert.status === "approved" ? "default" : "secondary"} className="text-sm">
            {expert.status === "approved" ? "Active Expert" : "Pending Approval"}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold gradient-text">₦{expert.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-chart-3">
                <TrendingUp className="w-4 h-4" />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Calls</p>
                  <p className="text-2xl font-bold">{expert.completedCalls}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">+8 this week</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{expert.rating}</p>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{expert.totalReviews} reviews</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">scheduled calls</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Calls */}
          <Card className="glass border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Calls
                </CardTitle>
                <Button variant="link" asChild className="text-primary">
                  <Link href="/expert/calls">View All</Link>
                </Button>
              </div>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
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
                            {new Date(booking.slotStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming calls</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Recent Reviews
              </CardTitle>
              <CardDescription>What your clients are saying</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls
                  .filter((c) => c.rating)
                  .map((call) => (
                    <div key={call.id} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={call.booking?.user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{call.booking?.user?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (call.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {call.review && <p className="text-sm text-muted-foreground">{call.review}</p>}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/expert/profile" className="block">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">Update Profile</p>
                  <p className="text-sm text-muted-foreground">Edit your bio and rate</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/expert/availability" className="block">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">Set Availability</p>
                  <p className="text-sm text-muted-foreground">Manage your schedule</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/expert/earnings" className="block">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">View Earnings</p>
                  <p className="text-sm text-muted-foreground">Check your payouts</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
