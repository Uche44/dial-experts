"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockCalls } from "@/lib/mock-data"
import { Phone, Search, Clock, Star } from "lucide-react"

export default function AdminCallsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCalls = mockCalls.filter(
    (call) =>
      call.booking?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.booking?.expert?.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalMinutes = mockCalls.reduce((acc, c) => acc + c.durationMinutes, 0)
  const avgDuration = Math.round(totalMinutes / mockCalls.length)
  const avgRating = (
    mockCalls.filter((c) => c.rating).reduce((acc, c) => acc + (c.rating || 0), 0) /
    mockCalls.filter((c) => c.rating).length
  ).toFixed(1)

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Call Logs</h1>
              <p className="text-muted-foreground">View all platform calls</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold">{mockCalls.length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Minutes</p>
              <p className="text-2xl font-bold">{totalMinutes}</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">{avgDuration} min</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold">{avgRating}</p>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calls Table */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>All Calls</CardTitle>
            <CardDescription>{filteredCalls.length} completed calls</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Expert</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={call.booking?.user?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {call.booking?.user?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{call.booking?.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={call.booking?.expert?.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {call.booking?.expert?.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{call.booking?.expert?.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {call.durationMinutes} min
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₦{call.amountCharged.toLocaleString()}</TableCell>
                    <TableCell>
                      {call.rating ? (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < call.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <Badge variant="secondary">No rating</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(call.startTime).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
