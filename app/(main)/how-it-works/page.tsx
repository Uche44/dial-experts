import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SolanaLogo } from "@/components/solana-logo"
import { Search, Calendar, Wallet, Video, CreditCard, Star, ArrowRight, Shield, Zap, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find Your Expert",
    description:
      "Browse our curated network of verified Web3 experts. Filter by specialization, rating, and availability to find the perfect match for your needs.",
  },
  {
    icon: Calendar,
    title: "Book a Time Slot",
    description:
      "Select a convenient 20-minute slot from the expert's available schedule. See the total cost preview before confirming your booking.",
  },
  {
    icon: Wallet,
    title: "Pre-Authorize Payment",
    description:
      "Approve a spending limit from your Solana wallet using delegate approval. Your funds stay in your wallet - only the maximum call cost is reserved.",
  },
  {
    icon: Video,
    title: "Join the Call",
    description:
      "Connect via HD video at the scheduled time. A real-time timer tracks your consultation duration up to the 20-minute limit.",
  },
  {
    icon: CreditCard,
    title: "Pay Per Minute",
    description:
      "Only pay for the actual minutes used. The platform automatically calculates the final cost and releases any unused funds back to your wallet.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "Share your experience by rating the expert. Your feedback helps maintain our quality standards and helps others find great consultants.",
  },
]

const benefits = [
  {
    icon: Shield,
    title: "Secure & Trustless",
    description: "Smart contracts ensure fair payments without intermediaries.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description: "Payments process instantly on Solana with minimal fees.",
  },
  {
    icon: CheckCircle,
    title: "Pay What You Use",
    description: "Never overpay - you're only charged for actual call duration.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <SolanaLogo className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Powered by Solana</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="gradient-text">DialExperts</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless consultation experience powered by Solana&apos;s delegate approvals. Pay only for what you use,
            with complete transparency.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                {index < steps.length - 1 && <div className="w-0.5 h-16 bg-border mx-auto mt-2" />}
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold mb-2">
                  <span className="text-primary mr-2">{(index + 1).toString().padStart(2, "0")}</span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose DialExperts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass border-border/50">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">Find an expert and book your first consultation today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 glow-primary">
              <Link href="/experts">
                Find an Expert
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/delegate-approval">Learn About Delegate Approvals</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
