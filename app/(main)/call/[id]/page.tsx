"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Clock,
  Star,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { PaymentCaptureModal } from "@/components/payment/payment-capture-modal";

export default function CallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const maxDuration = 20 * 60; // 20 minutes in seconds

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load call details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, toast]);

  useEffect(() => {
    if (!booking) return;

    // Simulate connection
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, [booking]);

  useEffect(() => {
    if (!isConnected) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => {
        if (prev >= maxDuration) {
          clearInterval(timer);
          handleAutoDisconnect();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  const handleAutoDisconnect = () => {
    setIsConnected(false);
    setShowPaymentModal(true);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating has been submitted.",
    });
    router.push("/dashboard");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading call...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Call Not Found</h1>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Connecting State */}
      {isConnecting && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Video className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
            <p className="text-muted-foreground">
              Setting up secure connection with {booking.expert?.user.name}
            </p>
          </div>
        </div>
      )}

      {/* Call Interface */}
      {isConnected && (
        <div className="flex-1 flex flex-col">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-black/90 flex items-center justify-center">
            {/* Remote Video (Expert) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/30">
                  <AvatarImage
                    src={booking.expert?.user.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {booking.expert?.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground">
                  {booking.expert?.user.name}
                </h2>
                <p className="text-muted-foreground">{booking.expert?.field}</p>
              </div>
            </div>

            {/* Local Video (User) - Picture in Picture */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-card rounded-lg border border-border/50 flex items-center justify-center">
              {isVideoOff ? (
                <VideoOff className="w-8 h-8 text-muted-foreground" />
              ) : (
                <div className="text-center">
                  <Avatar className="w-12 h-12 mx-auto">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Call Timer */}
            <Card className="absolute top-4 left-1/2 -translate-x-1/2 glass border-border/50">
              <CardContent className="py-2 px-4 flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(callDuration)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {formatTime(maxDuration)}
                </span>
              </CardContent>
            </Card>

            {/* Time Warning */}
            {callDuration >= maxDuration - 60 && (
              <Card className="absolute top-16 left-1/2 -translate-x-1/2 bg-destructive/20 border-destructive/50">
                <CardContent className="py-2 px-4 text-sm text-destructive-foreground">
                  Call ending in {maxDuration - callDuration} seconds
                </CardContent>
              </Card>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-card border-t border-border/50">
            <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${
                  isMuted ? "bg-destructive/20 border-destructive" : ""
                }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 ${
                  isVideoOff ? "bg-destructive/20 border-destructive" : ""
                }`}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6" />
                ) : (
                  <Video className="w-6 h-6" />
                )}
              </Button>
              <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-destructive hover:bg-destructive/90"
                onClick={handleEndCall}
              >
                <PhoneOff className="w-7 h-7" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-transparent"
              >
                <Monitor className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 bg-transparent"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <PaymentCaptureModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        expertName={booking.expert?.user.name || "Expert"}
        expertRate={booking.expert?.ratePerMin || 0}
        callDuration={callDuration}
        maxAuthorized={booking.cost || 0}
        onComplete={handlePaymentComplete}
      />

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your consultation with {booking.expert?.user.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Skip
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0}
              className="bg-primary hover:bg-primary/90"
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
