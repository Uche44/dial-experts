"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { LiveVideo } from "@/components/call/live-video";
import { useAuth } from "@/lib/auth-context";
import { useStream } from "@/hooks/use-stream";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, Wallet, Lock } from "lucide-react";

export default function CallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { startStream, endStream, loading: streamLoading } = useStream();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  // State to track if the stream (payment) has been initiated
  const [streamActive, setStreamActive] = useState(false);

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

  // Simulation Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (streamActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => {
          // Auto-end after 60 seconds for simulation
          if (prev >= 60) {
            handleDisconnect();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [streamActive]);

  const handleStartCall = async () => {
    // alert(booking);
    if (!booking || !booking.expert) return;

    try {
      // SIMULATION: Bypass blockchain stream start
      // const ratePerMin = booking.expert.ratePerMin || 1;
      // const ratePerSecond = Math.ceil((ratePerMin / 60) * 1_000_000); // 6 decimals for USDC
      // const maxAmount = booking.cost || 10;
      // await startStream(booking.expert.walletAddress, maxAmount, ratePerSecond);

      setStreamActive(true);
      toast({
        title: "Call Started (Simulation)",
        description: "You are now connected.",
      });
    } catch (error) {
      console.error("Failed to start stream:", error);
      toast({
        title: "Connection Failed",
        description: "Could not start the call.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    // End the stream on the blockchain
    if (streamActive && booking) {
      try {
        // SIMULATION: Bypass blockchain settlement
        // const expertAddress = booking.expert.walletAddress;
        // const userAddress =
        //   user?.role === "user"
        //     ? user?.walletAddress
        //     : booking.user?.walletAddress;

        // if (expertAddress && userAddress) {
        //   await endStream(expertAddress, userAddress);
        // }

        toast({
          title: "Call Ended",
          description: "Simulation complete.",
        });
      } catch (error) {
        console.error("Error closing stream:", error);
      }
    }

    setStreamActive(false);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating has been submitted.",
    });
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
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

  // Pre-call check for User
  if (user?.role === "user" && !streamActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Secure Payment
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To start the call with {booking.expert?.user.name}, please escrow
              the estimated cost. Unused funds will be refunded instantly after
              the call.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">
                ${booking.expert?.ratePerMin}/min
              </span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-muted-foreground">Est. Max Cost</span>
              <span className="font-bold text-lg">${booking.cost}</span>
            </div>

            <Button
              onClick={handleStartCall}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              disabled={streamLoading}
            >
              {streamLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              {streamLoading ? "Processing..." : "Start Call (Simulation)"}
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Powered by Solana Smart Contracts
            </p>
          </div>

          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Waiting screen for Expert (optional, could just let them join)
  if (user?.role === "expert" && !streamActive) {
    // For this MVP, we might want to let the expert join and wait,
    // or force them to wait until user starts.
    // Let's provide a "Join" button that just sets streamActive to true locally
    // assuming they verified off-band or we add a check later.
    // Or better, just show the video and let them wait in the lobby.
    // But to keep it consistent with "User initiates", let's show a prompt.

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-muted-foreground mb-6">
            Ensure the client has initiated the call.
          </p>
          <Button onClick={() => setStreamActive(true)} size="lg">
            Join Call
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1 relative">
        <LiveVideo
          room={id}
          username={user?.name || "Guest"}
          onDisconnected={handleDisconnect}
        />
        {streamActive && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
            Simulation Time: {Math.floor(callDuration / 60)}:
            {(callDuration % 60).toString().padStart(2, "0")} / 01:00
          </div>
        )}
      </div>

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
