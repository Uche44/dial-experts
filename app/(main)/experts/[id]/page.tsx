"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, Clock, Phone, CalendarIcon, ChevronLeft, Wallet } from "lucide-react"
import { mockExperts } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { WalletConnectModal } from "@/components/payment/wallet-connect-modal"
import { PreAuthModal } from "@/components/payment/pre-auth-modal"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

export default function ExpertProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const expert = mockExperts.find((e) => e.id === id)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showPreAuthModal, setShowPreAuthModal] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!expert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Expert Not Found</h1>
          <Button asChild>
            <Link href="/experts">Browse Experts</Link>
          </Button>
        </div>
      </div>
    )
  }

  const callCost = expert.ratePerMin * 20

  const handleBookSlot = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to book a consultation.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Select a slot",
        description: "Please select both a date and time slot.",
        variant: "destructive",
      })
      return
    }

    setShowBookingModal(true)
  }

  const handleConfirmBooking = () => {
    setShowBookingModal(false)
    if (user?.walletAddress) {
      setWalletAddress(user.walletAddress)
      setShowPreAuthModal(true)
    } else {
      setShowWalletModal(true)
    }
  }

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setShowWalletModal(false)
    setShowPreAuthModal(true)
  }

  const handlePreAuthApprove = () => {
    setShowPreAuthModal(false)
    toast({
      title: "Booking confirmed!",
      description: "Your consultation has been scheduled. Check your dashboard for details.",
    })
    router.push("/dashboard")
  }

  const isDateAvailable = (date: Date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    return expert.availability.some((slot) => slot.day === dayName) && date >= new Date()
  }

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
                    <AvatarImage src={expert.user.avatar || "/placeholder.svg"} alt={expert.user.name} />
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
                        <h1 className="text-2xl font-bold">{expert.user.name}</h1>
                        <Badge variant="secondary" className="mt-2">
                          {expert.field}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-xl font-bold">{expert.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{expert.totalReviews} reviews</p>
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
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                        const slot = expert.availability.find((s) => s.day === day)
                        return (
                          <div
                            key={day}
                            className={`p-4 rounded-lg border ${
                              slot ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/20"
                            }`}
                          >
                            <p className="font-medium">{day}</p>
                            {slot ? (
                              <p className="text-sm text-primary">
                                {slot.startTime} - {slot.endTime}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Unavailable</p>
                            )}
                          </div>
                        )
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
                        <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">User {i}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Excellent consultation! Very knowledgeable and helpful. Would definitely book again.
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
                  <span className="text-3xl font-bold gradient-text">₦{expert.ratePerMin}</span>
                  <span className="text-muted-foreground text-lg">/minute</span>
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">20 min session = ₦{callCost}</p>
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
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 12).map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          className={selectedTime === time ? "bg-primary" : ""}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
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
                  Pre-authorization required. You only pay for actual call duration.
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
            <DialogDescription>Review your consultation details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={expert.user.avatar || "/placeholder.svg"} alt={expert.user.name} />
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span>20 minutes</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-border/50">
                <span>Max Cost</span>
                <span className="text-primary">₦{callCost}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <Wallet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">Solana Delegate Approval</p>
                <p className="text-muted-foreground mt-1">
                  You&apos;ll pre-authorize up to ₦{callCost}. Only actual minutes used will be charged.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} className="bg-primary hover:bg-primary/90">
              <Wallet className="mr-2 w-4 h-4" />
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} onConnect={handleWalletConnect} />

      <PreAuthModal
        open={showPreAuthModal}
        onOpenChange={setShowPreAuthModal}
        expertName={expert.user.name}
        expertRate={expert.ratePerMin}
        maxAmount={callCost}
        walletAddress={walletAddress || user?.walletAddress || ""}
        onApprove={handlePreAuthApprove}
        onCancel={() => setShowPreAuthModal(false)}
      />
    </div>
  )
}
