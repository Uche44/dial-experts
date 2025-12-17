"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import {
  History,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/bookings?status=completed");
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchHistory();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Generate transactions from bookings
  const transactions = bookings.map((booking) => ({
    id: booking.id,
    type: "payment",
    amount: booking.cost,
    from: "You",
    to: booking.expert?.user?.name || "Expert",
    status: "completed",
    createdAt: booking.createdAt,
  }));

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
          <h1 className="text-2xl sm:text-3xl font-bold">
            Call & Payment History
          </h1>
        </div>

        <div className="grid gap-8">
          {/* Past Calls */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Past Consultations</CardTitle>
              <CardDescription>
                Your completed calls with experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              booking.expert?.user.avatar || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {booking.expert?.user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {booking.expert?.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.expert?.field}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.slotStart).toLocaleDateString()} •
                            20 minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Rating display could be added here if available in booking/call data */}
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            ₦{booking.cost}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No past consultations found.
                  </p>
                </div>
              )}
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
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-destructive">
                          -₦{tx.amount}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.to}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
