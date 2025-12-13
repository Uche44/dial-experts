"use client";

import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import SignupForm from "./auth/sign-up";
import { useToast } from "@/hooks/use-toast";

export function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const router = useRouter();
  const { toast } = useToast();

  const [isChecking, setIsChecking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      checkWalletInDB(address);
    }
  }, [isConnected, address]);

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
        window.location.href = loginData.user.role === "expert" ? "/expert" : "/dashboard";
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

  const handleConnect = async () => {
    await open();
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

  if (isConnected && isChecking) {
    return (
      <Button
        disabled
        className="gap-2"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Verifying...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <>
        <Button
          variant="outline"
          className="gap-2 bg-primary hover:bg-primary/90 glow-primary"
        >
          <Wallet className="h-4 w-4" />
          {address.slice(0, 4)}...{address.slice(-4)}
        </Button>

        {showOnboarding && walletAddress && (
          <div className="fixed h-screen inset-0 z-999 flex items-center justify-center bg-black/50">
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

  return (
    <Button
      onClick={handleConnect}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
