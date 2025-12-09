"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { mockExperts, mockUsers, mockTransactions, mockCalls } from "@/lib/mock-data"
import { Users, Briefcase, DollarSign, Phone, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const pendingExperts = mockExperts.filter((e) => e.status === "pending").length
  const totalRevenue = mockTransactions
    .filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0)
  const platformFees = Math.round(totalRevenue * 0.05)

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>

        {/* Alerts */}
        {pendingExperts > 0 && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">
                    {pendingExperts} expert application{pendingExperts > 1 ? "s" : ""} pending review
                  </p>
                  <p className="text-sm text-muted-foreground">New experts are waiting for approval</p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/experts">Review Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "user").length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
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
                  <p className="text-sm text-muted-foreground">Active Experts</p>
                  <p className="text-2xl font-bold">{mockExperts.filter((e) => e.status === "approved").length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{pendingExperts} pending approval</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold gradient-text">₦{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Platform fees: ₦{platformFees.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold">{mockCalls.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/experts">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Expert Management
                </CardTitle>
                <CardDescription>Review applications, manage expert accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{mockExperts.length} total experts</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {mockUsers.filter((u) => u.role === "user").length} registered users
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/transactions">
            <Card className="glass border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Transactions
                </CardTitle>
                <CardDescription>View all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{mockTransactions.length} transactions</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
