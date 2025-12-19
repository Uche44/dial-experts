import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ToastAction } from "@/components/ui/toast";

export const useNotifications = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const notifiedBookings = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const checkUpcomingCalls = async () => {
      try {
        // Fetch user's bookings (assuming an endpoint exists or we filter from all bookings)
        // For efficiency, we should probably have an endpoint for "upcoming bookings"
        // But for now, let's assume we can fetch from /api/bookings?status=upcoming
        const response = await fetch("/api/bookings?status=upcoming");
        if (!response.ok) return;

        const bookings = await response.json();
        const now = new Date().getTime();

        bookings.forEach((booking: any) => {
          const slotStart = new Date(booking.slotStart).getTime();
          const diff = slotStart - now;

          // Notify if call is within 5 minutes (300000 ms) and hasn't been notified yet
          if (
            diff > 0 &&
            diff <= 5 * 60 * 1000 &&
            !notifiedBookings.current.has(booking.id)
          ) {
            notifiedBookings.current.add(booking.id);

            toast({
              title: "Upcoming Call",
              description: `Your call with ${
                booking.expert?.user.name || "Expert"
              } starts in ${Math.ceil(diff / 60000)} minutes.`,
              action: (
                <ToastAction
                  altText="Join Call"
                  onClick={() => router.push(`/call/${booking.id}`)}
                >
                  Join Call
                </ToastAction>
              ),
            });
          }
        });
      } catch (error) {
        console.error("Error checking upcoming calls:", error);
      }
    };

    // Check every minute
    const interval = setInterval(checkUpcomingCalls, 60 * 1000);

    // Initial check
    checkUpcomingCalls();

    return () => clearInterval(interval);
  }, [user, toast, router]);
};
