"use client"

import { useState, useEffect } from "react"
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
import { DollarSign, CheckCircle, ArrowRight, RefreshCcw, Loader2, Clock, Receipt } from "lucide-react"
import { SolanaLogo } from "@/components/solana-logo"

interface PaymentCaptureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expertName: string
  expertRate: number
  callDuration: number
  maxAuthorized: number
  onComplete: () => void
}

type Step = "calculating" | "capturing" | "releasing" | "complete"

export function PaymentCaptureModal({
  open,
  onOpenChange,
  expertName,
  expertRate,
  callDuration,
  maxAuthorized,
  onComplete,
}: PaymentCaptureModalProps) {
  const [step, setStep] = useState<Step>("calculating")
  const [progress, setProgress] = useState(0)

  const minutesUsed = Math.ceil(callDuration / 60)
  const actualCharge = expertRate * minutesUsed
  const refundAmount = maxAuthorized - actualCharge
  const platformFee = actualCharge * 0.05
  const expertPayout = actualCharge - platformFee

  useEffect(() => {
    if (!open) return

    const runCapture = async () => {
      setStep("calculating")
      setProgress(0)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStep("capturing")
      for (let i = 0; i <= 50; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      setStep("releasing")
      for (let i = 50; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      setStep("complete")
    }

    runCapture()
  }, [open])

  const handleClose = () => {
    onComplete()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "complete" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <DollarSign className="w-5 h-5 text-primary" />
            )}
            {step === "calculating" && "Calculating Charges"}
            {step === "capturing" && "Processing Payment"}
            {step === "releasing" && "Releasing Remainder"}
            {step === "complete" && "Payment Complete"}
          </DialogTitle>
          <DialogDescription>
            {step !== "complete" && "Processing your consultation payment..."}
            {step === "complete" && "Your payment has been successfully processed"}
          </DialogDescription>
        </DialogHeader>

        {step !== "complete" && (
          <div className="py-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step === "calculating" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-500"
                }`}
              >
                {step === "calculating" ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step === "capturing"
                    ? "bg-primary/20 text-primary"
                    : step === "releasing"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted/20 text-muted-foreground"
                }`}
              >
                {step === "capturing" ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : step === "releasing" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <DollarSign className="w-6 h-6" />
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step === "releasing" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground"
                }`}
              >
                {step === "releasing" ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <RefreshCcw className="w-6 h-6" />
                )}
              </div>
            </div>

            <Progress value={progress} className="h-2 mb-4" />

            <div className="text-center text-sm text-muted-foreground">
              {step === "calculating" && "Calculating actual call duration..."}
              {step === "capturing" && "Capturing payment from your wallet..."}
              {step === "releasing" && "Releasing unused authorization..."}
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="py-6 space-y-6">
            {/* Transaction Summary */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <SolanaLogo className="w-5 h-5" />
                <span className="font-medium text-green-400">Transaction Confirmed</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold">₦{actualCharge}</span>
                <p className="text-sm text-muted-foreground mt-1">Total Charged</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Call Duration
                </span>
                <span>{formatDuration(callDuration)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minutes Billed</span>
                <span>{minutesUsed} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>₦{expertRate}/min</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Your Charge</span>
                <span className="font-medium">₦{actualCharge}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span>₦{platformFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expert Receives</span>
                <span className="text-teal-400">₦{expertPayout}</span>
              </div>
              {refundAmount > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                  <span className="text-green-400 flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Released Back
                  </span>
                  <span className="text-green-400">₦{refundAmount}</span>
                </div>
              )}
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Transaction ID
              </span>
              <code className="text-xs font-mono text-primary">
                {Math.random().toString(36).slice(2, 10)}...{Math.random().toString(36).slice(2, 6)}
              </code>
            </div>
          </div>
        )}

        {step === "complete" && (
          <DialogFooter>
            <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
              Continue
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
