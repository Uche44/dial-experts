"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  Download,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface MonthlyStat {
  month: string;
  calls: number;
  earnings: number;
  payout: number;
}

export default function EarningsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [expert, setExpert] = useState<any>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyStat[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const platformFee = 5;

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch expert profile
        const profileRes = await fetch("/api/expert/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setExpert(profileData);
        }

        // Fetch bookings for earnings calculation
        const bookingsRes = await fetch(
          "/api/expert/bookings?status=completed"
        );
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();

          // Calculate monthly stats
          const statsMap = bookingsData.reduce((acc: any, booking: any) => {
            const date = new Date(booking.slotStart);
            const month = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });

            if (!acc[month]) {
              acc[month] = { month, calls: 0, earnings: 0, payout: 0 };
            }

            const amount = booking.call?.amountCharged || booking.cost || 0;
            acc[month].calls += 1;
            acc[month].earnings += amount;
            acc[month].payout += amount * (1 - platformFee / 100);

            return acc;
          }, {});

          const statsArray = Object.values(statsMap) as MonthlyStat[];
          setMonthlyEarnings(statsArray);

          // Recent transactions (using completed bookings as proxy for now)
          const transactions = bookingsData
            .sort(
              (a: any, b: any) =>
                new Date(b.slotStart).getTime() -
                new Date(a.slotStart).getTime()
            )
            .slice(0, 5)
            .map((b: any) => ({
              id: b.id,
              type: "earning",
              amount: b.call?.amountCharged || b.cost || 0,
              date: b.slotStart,
              description: `Consultation with ${b.user?.name}`,
            }));
          setRecentTransactions(transactions);
        }
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Expert profile not found.</p>
      </div>
    );
  }

  const thisMonth = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  const thisMonthEarnings = monthlyEarnings.find(
    (m) => m.month === thisMonth
  ) || { month: thisMonth, calls: 0, earnings: 0, payout: 0 };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Earnings</h1>
              <p className="text-muted-foreground">
                Track your income and payouts
              </p>
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
                  <p className="text-sm text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold gradient-text">
                    ₦{expert.totalEarnings?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    ₦{thisMonthEarnings.earnings.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-chart-3">
                <TrendingUp className="w-4 h-4" />
                <span>+0% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Payout</p>
                  <p className="text-2xl font-bold">
                    ₦{thisMonthEarnings.payout.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                After {platformFee}% platform fee
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Calls This Month
                  </p>
                  <p className="text-2xl font-bold">
                    {thisMonthEarnings.calls}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Completed consultations
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Breakdown */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>
                Your earnings over the past months
              </CardDescription>
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
                  {monthlyEarnings.length > 0 ? (
                    monthlyEarnings.map((data, index) => (
                      <TableRow key={data.month}>
                        <TableCell className="font-medium">
                          {data.month}
                          {data.month === thisMonth && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Current
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.calls}
                        </TableCell>
                        <TableCell className="text-right">
                          ₦{data.earnings.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-primary font-medium">
                          ₦{data.payout.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No earnings yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Recent Earnings</CardTitle>
              <CardDescription>Your latest completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <ArrowDownLeft className="w-5 h-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-chart-3">
                        +₦{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Earned</p>
                    </div>
                  </div>
                ))}

                {recentTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No recent transactions
                    </p>
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
                <p className="text-3xl font-bold text-destructive">
                  -{platformFee}%
                </p>
                <p className="text-sm text-muted-foreground">Platform fee</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-3xl font-bold gradient-text">
                  {100 - platformFee}%
                </p>
                <p className="text-sm text-muted-foreground">You receive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
