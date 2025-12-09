"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { mockCalls, mockTransactions } from "@/lib/mock-data"
import { History, Star, ArrowUpRight, ArrowDownLeft, ChevronLeft } from "lucide-react"

export default function HistoryPage() {
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

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Call & Payment History</h1>
        </div>

        <div className="grid gap-8">
          {/* Past Calls */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Past Consultations</CardTitle>
              <CardDescription>Your completed calls with experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
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
                        <p className="text-sm text-muted-foreground">{call.booking?.expert?.field}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(call.startTime).toLocaleDateString()} • {call.durationMinutes} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
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
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your payment and refund records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "payment" ? (
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          ) : tx.type === "refund" ? (
                            <ArrowDownLeft className="w-4 h-4 text-chart-3" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-primary" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className={tx.type === "payment" ? "text-destructive" : "text-chart-3"}>
                        {tx.type === "payment" ? "-" : "+"}₦{tx.amount}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{tx.type === "payment" ? tx.to : tx.from}</TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
