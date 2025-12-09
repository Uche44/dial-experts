"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockExperts, mockTransactions } from "@/lib/mock-data"
import { DollarSign, TrendingUp, Wallet, ArrowDownLeft, Download, Calendar } from "lucide-react"

export default function EarningsPage() {
  const expert = mockExperts[0]
  const payouts = mockTransactions.filter((tx) => tx.type === "payout")

  // Mock monthly earnings data
  const monthlyEarnings = [
    { month: "Dec 2024", calls: 45, earnings: 32500, payout: 30875 },
    { month: "Nov 2024", calls: 38, earnings: 28000, payout: 26600 },
    { month: "Oct 2024", calls: 52, earnings: 41000, payout: 38950 },
    { month: "Sep 2024", calls: 41, earnings: 31000, payout: 29450 },
  ]

  const thisMonthEarnings = monthlyEarnings[0]
  const platformFee = 5

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Earnings</h1>
              <p className="text-muted-foreground">Track your income and payouts</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
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
              <p className="text-sm text-muted-foreground mt-2">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₦{thisMonthEarnings.earnings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-chart-3">
                <TrendingUp className="w-4 h-4" />
                <span>+16% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Payout</p>
                  <p className="text-2xl font-bold">₦{thisMonthEarnings.payout.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">After {platformFee}% platform fee</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calls This Month</p>
                  <p className="text-2xl font-bold">{thisMonthEarnings.calls}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Completed consultations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Breakdown */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>Your earnings over the past months</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyEarnings.map((data, index) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">
                        {data.month}
                        {index === 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{data.calls}</TableCell>
                      <TableCell className="text-right">₦{data.earnings.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-primary font-medium">
                        ₦{data.payout.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Payouts */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Your latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <ArrowDownLeft className="w-5 h-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-medium">Payout</p>
                        <p className="text-sm text-muted-foreground font-mono">{payout.to}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-chart-3">+₦{payout.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payout.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}

                {payouts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No payouts yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Breakdown */}
        <Card className="glass border-border/50 mt-8">
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
            <CardDescription>How your earnings are calculated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Client pays</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20">
                <p className="text-3xl font-bold text-destructive">-{platformFee}%</p>
                <p className="text-sm text-muted-foreground">Platform fee</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-3xl font-bold gradient-text">{100 - platformFee}%</p>
                <p className="text-sm text-muted-foreground">You receive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
