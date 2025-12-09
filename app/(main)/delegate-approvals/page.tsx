"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Shield,
  ArrowRight,
  CheckCircle,
  Lock,
  Unlock,
  DollarSign,
  Clock,
  AlertCircle,
  ChevronRight,
  Code,
  Zap,
  RefreshCcw,
} from "lucide-react"
import { SolanaLogo } from "@/components/solana-logo"
import Link from "next/link"

const flowSteps = [
  {
    icon: Wallet,
    title: "1. Connect Wallet",
    description: "User connects their Solana wallet to the platform",
    color: "text-teal-400",
  },
  {
    icon: DollarSign,
    title: "2. Calculate Cost",
    description: "System calculates max spend: expert_rate × 20 minutes",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "3. Approve Delegate",
    description: "User approves platform PDA to spend up to the calculated amount",
    color: "text-violet-400",
  },
  {
    icon: Lock,
    title: "4. Funds Reserved",
    description: "Funds remain in user's wallet, just reserved for the call",
    color: "text-amber-400",
  },
  {
    icon: Clock,
    title: "5. Call Happens",
    description: "User and expert have their consultation session",
    color: "text-teal-400",
  },
  {
    icon: Zap,
    title: "6. Payment Captured",
    description: "Only actual minutes used are charged to user",
    color: "text-primary",
  },
  {
    icon: RefreshCcw,
    title: "7. Refund Remainder",
    description: "Unused authorization is automatically released",
    color: "text-green-400",
  },
  {
    icon: Unlock,
    title: "8. Revoke Approval",
    description: "Delegate approval is revoked after transaction",
    color: "text-violet-400",
  },
]

const technicalCode = `// Step 1: Create delegate approval
Approve {
  delegate: platform_pda,
  amount: max_spend,
  mint: USDC_MINT
}

// Step 2: Transfer actual amount after call
TransferChecked {
  authority: platform_pda,
  from: user_ata,
  to: expert_ata,
  amount: actual_spend,
  mint: USDC_MINT
}

// Step 3: Revoke remaining approval
Revoke {
  delegate: platform_pda,
  owner: user_wallet
}`

const benefits = [
  {
    icon: Shield,
    title: "Non-Custodial",
    description: "Your funds never leave your wallet until the actual charge",
  },
  {
    icon: Lock,
    title: "Limited Spending",
    description: "Platform can only spend up to the approved amount",
  },
  {
    icon: CheckCircle,
    title: "Pay Only For Use",
    description: "You're only charged for actual minutes consumed",
  },
  {
    icon: RefreshCcw,
    title: "Auto-Refund",
    description: "Unused funds are automatically released after call",
  },
]

const faqs = [
  {
    question: "Can the platform take more than I approved?",
    answer:
      "No. The delegate approval sets a hard limit. The platform can only transfer up to the amount you approved, never more.",
  },
  {
    question: "What happens if I don't use all 20 minutes?",
    answer:
      "You only pay for the minutes you use. If your call lasts 12 minutes, you're charged for 12 minutes and the rest is released.",
  },
  {
    question: "Is my wallet safe?",
    answer:
      "Yes. Delegate approval only allows the platform to spend from your associated token account (ATA) up to the approved limit. It cannot access other tokens or SOL.",
  },
  {
    question: "What is a PDA?",
    answer:
      "A Program Derived Address (PDA) is a special account controlled by the platform's smart contract, not by any individual. It ensures trustless payment processing.",
  },
]

export default function DelegateApprovalsPage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <SolanaLogo className="w-5 h-5" />
            <span className="text-sm font-medium">Powered by Solana</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Understanding <span className="gradient-text">Delegate Approvals</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how DialExperts uses Solana&apos;s delegate approval mechanism to enable secure, non-custodial
            payments for consultations.
          </p>
        </div>

        {/* Simple Explanation Card */}
        <Card className="glass border-border/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              The Simple Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              Think of delegate approval like giving a{" "}
              <span className="text-primary font-semibold">pre-authorization</span> on your credit card at a hotel.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Reserve</h3>
                <p className="text-sm text-muted-foreground">The maximum amount is reserved, but you still own it</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-2">Use Service</h3>
                <p className="text-sm text-muted-foreground">Have your consultation, use only what you need</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Pay Actual</h3>
                <p className="text-sm text-muted-foreground">Only pay for minutes used, rest is released</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Visualization */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {flowSteps.slice(0, 4).map((step, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-xl border transition-all cursor-pointer ${
                    activeStep === index
                      ? "bg-primary/10 border-primary/50 scale-105"
                      : "bg-card/50 border-border/50 hover:border-primary/30"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4 ${step.color}`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {index < 3 && (
                    <ChevronRight className="absolute top-1/2 -right-4 w-6 h-6 text-muted-foreground hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="hidden lg:flex justify-center my-4">
              <ArrowRight className="w-8 h-8 text-primary rotate-90" />
            </div>
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {flowSteps.slice(4, 8).map((step, index) => (
                <div
                  key={index + 4}
                  className={`relative p-6 rounded-xl border transition-all cursor-pointer ${
                    activeStep === index + 4
                      ? "bg-primary/10 border-primary/50 scale-105"
                      : "bg-card/50 border-border/50 hover:border-primary/30"
                  }`}
                  onClick={() => setActiveStep(index + 4)}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4 ${step.color}`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-4">
              {flowSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    activeStep === index ? "bg-primary/10 border-primary/50" : "bg-card/50 border-border/50"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0 ${step.color}`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Delegate Approvals?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass border-border/50 text-center">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <Tabs defaultValue="simple" className="mb-16">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="simple">Simple View</TabsTrigger>
            <TabsTrigger value="technical">Technical View</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="mt-6">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Visual Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
                  <div className="text-center p-6 rounded-xl bg-muted/20 border border-border/50 min-w-[140px]">
                    <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Your Wallet</p>
                    <p className="text-sm text-muted-foreground">100 USDC</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-primary md:rotate-0 rotate-90" />
                    <span className="text-xs text-muted-foreground mt-1">Approve 20 USDC</span>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-violet-500/10 border border-violet-500/30 min-w-[140px]">
                    <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <p className="font-medium">Platform PDA</p>
                    <p className="text-sm text-muted-foreground">Can spend up to 20</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-teal-400 md:rotate-0 rotate-90" />
                    <span className="text-xs text-muted-foreground mt-1">Transfer 12 USDC</span>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-teal-500/10 border border-teal-500/30 min-w-[140px]">
                    <DollarSign className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <p className="font-medium">Expert</p>
                    <p className="text-sm text-muted-foreground">Receives 12 USDC</p>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Result: User still has 88 USDC, Expert received 12 USDC, 8 USDC approval was unused and released
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Solana Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-6 rounded-xl bg-black/50 border border-border/50 overflow-x-auto text-sm">
                  <code className="text-teal-400">{technicalCode}</code>
                </pre>
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold">Key Components:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">platform_pda</strong> - Program Derived Address controlled
                        by DialExperts smart contract
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">user_ata</strong> - User&apos;s Associated Token Account for
                        USDC
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">expert_ata</strong> - Expert&apos;s Associated Token Account
                        to receive payment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">TransferChecked</strong> - SPL Token instruction that
                        enforces decimal precision
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="glass border-primary/30 bg-primary/5 text-center">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Try It?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Experience secure, non-custodial payments powered by Solana delegate approvals. Book a consultation with
              an expert today.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 glow-primary">
              <Link href="/experts">
                Browse Experts
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
