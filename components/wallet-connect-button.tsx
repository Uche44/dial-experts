"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SignupForm from "./auth/sign-up";
import { useToast } from "@/hooks/use-toast";

export function WalletConnectButton() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toBase58();
  const router = useRouter();
  const { toast } = useToast();

  const [isChecking, setIsChecking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && address) {
      checkWalletInDB(address);
    }
  }, [connected, address]);

  const checkWalletInDB = async (wallet: string) => {
    setIsChecking(true);
    try {
      const response = await fetch(`/api/auth/check-wallet?address=${wallet}`);
      const data = await response.json();

      if (data.exists) {
        // User exists - log them in by calling the login endpoint
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress: wallet }),
        });

        if (!loginResponse.ok) {
          throw new Error("Login failed");
        }

        const loginData = await loginResponse.json();

        toast({
          title: "Welcome back!",
          description: `Logged in as ${loginData.user.name}`,
        });

        // Reload the page to trigger auth context refresh
        window.location.href =
          loginData.user.role === "expert" ? "/expert" : "/dashboard";
      } else {
        // New user - show signup modal
        setWalletAddress(wallet);
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
      toast({
        title: "Error",
        description: "Failed to verify wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignupComplete = (role: string) => {
    setShowOnboarding(false);
    toast({
      title: "Account created!",
      description:
        role === "expert"
          ? "Your expert application is pending review."
          : "Welcome to DialExperts!",
    });
    // Reload the page to trigger auth context refresh
    window.location.href = role === "expert" ? "/expert" : "/dashboard";
  };

  if (connected && isChecking) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Verifying...
      </Button>
    );
  }

  // If connected and not checking, we show the standard button which handles disconnect/copy address
  // But we also need to render the onboarding modal if needed
  return (
    <>
      <WalletMultiButton />

      {showOnboarding && walletAddress && (
        <div className="fixed h-screen inset-0 z-[999] flex items-center justify-center bg-black/50">
          <SignupForm
            isOpen={showOnboarding}
            onClose={() => setShowOnboarding(false)}
            walletAddress={walletAddress}
            onComplete={handleSignupComplete}
          />
        </div>
      )}
    </>
  );
}

// Let us start integrating live kit and make the video conferencing work.
// This is the way it should work: user books a call with an expert, when the time comes the user initiates the call, and our smart contract is called to create a token streaming program with the necessary details (the expert cannot join if the user hasn't initiated the call yet, this way we prevent unnecessary charges on the user), when the expert joins
