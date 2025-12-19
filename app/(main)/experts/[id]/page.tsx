"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Clock,
  Phone,
  CalendarIcon,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
// import { WalletConnectModal } from "@/components/payment/wallet-connect-modal"
// import { PreAuthModal } from "@/components/payment/pre-auth-modal"
import type { Expert } from "@/lib/types";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

export default function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { setVisible } = useWalletModal();

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(20);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/experts/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Expert not found");
          } else {
            setError("Failed to load expert profile");
          }
          return;
        }

        const data = await response.json();
        setExpert(data);
      } catch (err) {
        console.error("Error fetching expert:", err);
        setError("Failed to load expert profile");
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Expert Not Found"}
          </h1>
          <Button asChild>
            <Link href="/experts">Browse Experts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const callCost = expert.ratePerMin * duration;

  const handleBookSlot = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to book a consultation.",
        variant: "destructive",
      });
      await open();
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Select a slot",
        description: "Please select both a date and time slot.",
        variant: "destructive",
      });
      return;
    }

    setShowBookingModal(true);
  };

  const handleBooking = async () => {
    if (!expert || !selectedDate || !selectedTime) {
      toast({
        title: "Invalid booking",
        description: "Please select a valid date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Build slot start datetime
      const slotStart = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      slotStart.setHours(Number(hours), Number(minutes), 0, 0);

      // Dynamic session duration
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expertId: expert.id,
          slotStart: slotStart.toISOString(),
          slotEnd: slotEnd.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      toast({
        title: "Booking confirmed",
        description: "Your consultation has been scheduled.",
      });

      // Close modal and redirect
      setShowBookingModal(false);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Booking error:", error);

      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayName: string | number = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      !!expert.availability?.[dayName as unknown as number] && date >= today
    );
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !expert.availability) return [];

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const availability = expert.availability as unknown as Record<
      string,
      { startTime: string; endTime: string }
    >;
    const dayAvailability = availability[dayName];

    if (!dayAvailability) return [];

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Filter time slots to only show those within expert's available hours
    return timeSlots.filter((time) => {
      const [slotHour, slotMinute] = time.split(":").map(Number);

      // If today, filter out past times
      if (isToday) {
        if (
          slotHour < currentHour ||
          (slotHour === currentHour && slotMinute <= currentMinute)
        ) {
          return false;
        }
      }

      return (
        time >= dayAvailability.startTime && time < dayAvailability.endTime
      );
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/experts"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Experts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="w-24 h-24 border-4 border-primary/30">
                    <AvatarImage
                      src={expert.user.avatar || "/placeholder.svg"}
                      alt={expert.user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {expert.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">
                          {expert.user.name}
                        </h1>
                        <Badge variant="secondary" className="mt-2">
                          {expert.field}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-xl font-bold">
                            {expert.rating}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {expert.totalReviews} reviews
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">{expert.bio}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {expert.completedCalls} calls completed
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        20 min sessions
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="availability" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="availability">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Weekly Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => {
                        // const slot = expert.availability?.find((s) => s.day === day)
                        const slot =
                          expert.availability?.[day as unknown as number];

                        return (
                          <div
                            key={day}
                            className={`p-4 rounded-lg border ${
                              slot
                                ? "border-primary/30 bg-primary/5"
                                : "border-border/50 bg-muted/20"
                            }`}
                          >
                            <p className="font-medium">{day}</p>
                            {slot ? (
                              <p className="text-sm text-primary">
                                {slot.startTime} - {slot.endTime}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Unavailable
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg bg-muted/20 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">User {i}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className="w-3 h-3 text-yellow-500 fill-yellow-500"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Excellent consultation! Very knowledgeable and
                            helpful. Would definitely book again.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="glass border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="text-3xl font-bold gradient-text">
                    ₦{expert.ratePerMin}
                  </span>
                  <span className="text-muted-foreground text-lg">/minute</span>
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Minimum 5 min session
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calendar */}
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => !isDateAvailable(date)}
                    className="rounded-md border border-border/50"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Available Times</p>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {getAvailableTimeSlots().map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          size="sm"
                          className={selectedTime === time ? "bg-primary" : ""}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {getAvailableTimeSlots().length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No available time slots for this day
                      </p>
                    )}
                  </div>
                )}

                <Button
                  className="w-full bg-primary hover:bg-primary/90 glow-primary"
                  size="lg"
                  onClick={handleBookSlot}
                  disabled={!selectedDate || !selectedTime}
                >
                  Book Consultation
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pre-authorization required. You only pay for actual call
                  duration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Review your consultation details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={expert.user.avatar || "/placeholder.svg"}
                  alt={expert.user.name}
                />
                <AvatarFallback>
                  {expert.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{expert.user.name}</p>
                <p className="text-sm text-muted-foreground">{expert.field}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span>{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Duration</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setDuration(Math.max(5, duration - 5))}
                    disabled={duration <= 5}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{duration} min</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setDuration(Math.min(20, duration + 5))}
                    disabled={duration >= 20}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-border/50">
                <span>Cost</span>
                <span className="text-primary">₦{callCost}</span>
              </div>
            </div>
            {/* <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <Wallet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">Solana Delegate Approval</p>
                <p className="text-muted-foreground mt-1">
                  You&apos;ll pre-authorize up to ₦{callCost}. Only actual minutes used will be charged.
                </p>
              </div>
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              className="bg-primary hover:bg-primary/90"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
