"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, ExternalLink, CheckCircle, Loader2 } from "lucide-react"
import { SolanaLogo } from "@/components/solana-logo"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (walletAddress: string) => void
}

const wallets = [
  { id: "phantom", name: "Phantom", icon: "👻", popular: true },
  { id: "solflare", name: "Solflare", icon: "☀️", popular: true },
  { id: "backpack", name: "Backpack", icon: "🎒", popular: false },
  { id: "glow", name: "Glow", icon: "✨", popular: false },
]

export function WalletConnectModal({ open, onOpenChange, onConnect }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setConnected(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate mock wallet address
    const mockAddress = `${walletId.slice(0, 4)}...${Math.random().toString(36).slice(2, 6)}`
    onConnect(mockAddress)

    setConnecting(null)
    setConnected(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>Connect your Solana wallet to continue with the booking</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={connecting !== null}
              className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                connecting === wallet.id
                  ? "bg-primary/10 border-primary/50"
                  : "bg-muted/20 border-border/50 hover:border-primary/30 hover:bg-muted/30"
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{wallet.name}</p>
                  {wallet.popular && <span className="text-xs text-primary">Popular</span>}
                </div>
              </div>
              {connecting === wallet.id ? (
                connected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )
              ) : (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <SolanaLogo className="w-4 h-4" />
            <span>Powered by Solana</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
