"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wallet, Shield, CheckCircle, Lock, Loader2, AlertTriangle } from "lucide-react"
import { SolanaLogo } from "@/components/solana-logo"

interface PreAuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expertName: string
  expertRate: number
  maxAmount: number
  walletAddress: string
  onApprove: () => void
  onCancel: () => void
}

type Step = "review" | "signing" | "confirming" | "success" | "error"

export function PreAuthModal({
  open,
  onOpenChange,
  expertName,
  expertRate,
  maxAmount,
  walletAddress,
  onApprove,
  onCancel,
}: PreAuthModalProps) {
  const [step, setStep] = useState<Step>("review")
  const [progress, setProgress] = useState(0)

  const platformFee = maxAmount * 0.05
  const expertPayout = maxAmount - platformFee

  const handleApprove = async () => {
    setStep("signing")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStep("confirming")
    // Animate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 150))
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setStep("success")

    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApprove()
  }

  const handleClose = () => {
    setStep("review")
    setProgress(0)
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : step === "error" ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <Shield className="w-5 h-5 text-primary" />
            )}
            {step === "review" && "Approve Delegate Spending"}
            {step === "signing" && "Waiting for Signature"}
            {step === "confirming" && "Confirming on Solana"}
            {step === "success" && "Approval Confirmed!"}
            {step === "error" && "Approval Failed"}
          </DialogTitle>
          <DialogDescription>
            {step === "review" && "Pre-authorize the maximum spend for this consultation"}
            {step === "signing" && "Please sign the transaction in your wallet"}
            {step === "confirming" && "Processing your approval on the Solana blockchain"}
            {step === "success" && "Your booking has been confirmed"}
            {step === "error" && "Something went wrong. Please try again."}
          </DialogDescription>
        </DialogHeader>

        {step === "review" && (
          <>
            <div className="space-y-4 py-4">
              {/* Wallet Info */}
              <div className="p-3 rounded-lg bg-muted/20 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm">Connected Wallet</span>
                </div>
                <code className="text-sm font-mono text-primary">{walletAddress}</code>
              </div>

              {/* Approval Details */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Delegate Approval Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expert</span>
                    <span>{expertName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span>₦{expertRate}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Duration</span>
                    <span>20 minutes</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/50">
                    <span className="text-muted-foreground">Max Authorization</span>
                    <span className="font-bold text-primary">₦{maxAmount}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <h4 className="text-sm font-medium mb-3">If full 20 minutes used:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span>₦{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expert Receives</span>
                    <span>₦{expertPayout}</span>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-400">Non-Custodial Security</p>
                  <p className="text-muted-foreground mt-1">
                    Funds remain in your wallet. You only pay for actual minutes used. Approval is automatically revoked
                    after the call.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-primary hover:bg-primary/90 glow-primary">
                <Shield className="mr-2 w-4 h-4" />
                Approve & Book
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "signing" && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">Please check your wallet and sign the transaction</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for signature...
            </div>
          </div>
        )}

        {step === "confirming" && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <SolanaLogo className="w-10 h-10 animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-4">Confirming on Solana blockchain...</p>
            <div className="max-w-xs mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-4">Your consultation with {expertName} has been scheduled</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm">
              <Lock className="w-4 h-4 text-primary" />
              <span>₦{maxAmount} pre-authorized</span>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-muted-foreground mb-6">The transaction was rejected or failed. Please try again.</p>
            <Button onClick={() => setStep("review")} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
