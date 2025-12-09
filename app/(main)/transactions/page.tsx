"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Extended mock transactions for user
const userTransactions = [
  {
    id: "tx-1",
    type: "payment",
    amount: 1500,
    expert: "Alex Thompson",
    duration: 20,
    date: new Date(Date.now() - 86400000),
    status: "completed",
    txHash: "5xK9...3mPz",
  },
  {
    id: "tx-2",
    type: "payment",
    amount: 1000,
    expert: "Dr. Sarah Chen",
    duration: 18,
    date: new Date(Date.now() - 172800000),
    status: "completed",
    txHash: "7yL2...9nQa",
  },
  {
    id: "tx-3",
    type: "refund",
    amount: 200,
    expert: "Dr. Sarah Chen",
    duration: 0,
    date: new Date(Date.now() - 172800000),
    status: "completed",
    txHash: "8zM4...1oRb",
  },
  {
    id: "tx-4",
    type: "payment",
    amount: 2000,
    expert: "Maria Garcia",
    duration: 20,
    date: new Date(Date.now() - 259200000),
    status: "completed",
    txHash: "9aN5...2pSc",
  },
  {
    id: "tx-5",
    type: "payment",
    amount: 600,
    expert: "James Wilson",
    duration: 10,
    date: new Date(Date.now() - 345600000),
    status: "completed",
    txHash: "2bO6...3qTd",
  },
]

export default function TransactionsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredTransactions = userTransactions.filter((tx) => {
    const matchesSearch = tx.expert.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalSpent = userTransactions.filter((tx) => tx.type === "payment").reduce((sum, tx) => sum + tx.amount, 0)

  const totalRefunded = userTransactions.filter((tx) => tx.type === "refund").reduce((sum, tx) => sum + tx.amount, 0)

  const totalCalls = userTransactions.filter((tx) => tx.type === "payment").length

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">View all your payment and refund transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold mt-1">₦{totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Refunded</p>
                  <p className="text-2xl font-bold mt-1 text-green-400">₦{totalRefunded.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold mt-1">{totalCalls}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass border-border/50 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by expert name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Expert</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">TX Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "payment" ? "bg-primary/10" : "bg-green-500/10"
                          }`}
                        >
                          {tx.type === "payment" ? (
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tx.expert}</TableCell>
                    <TableCell>
                      <span className={tx.type === "payment" ? "text-foreground" : "text-green-400"}>
                        {tx.type === "refund" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>{tx.duration > 0 ? `${tx.duration} min` : "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/30">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs font-mono">
                        {tx.txHash}
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
