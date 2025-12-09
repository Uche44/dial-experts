"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Zap, Users } from "lucide-react"
import { SolanaLogo } from "@/components/solana-logo"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <SolanaLogo className="w-4 h-4" />
            {/* <span className="text-sm text-muted-foreground">
              Powered by Solana Delegate Approvals
            </span> */}
            <span className="text-sm text-muted-foreground">
              Powered by Solana
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Quick Expert Answers,{" "}
            <span className="gradient-text">No Hassle</span>
            <br />
            Pay Only for the Time You Spend
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Book micro-consultations with experts across any field.
            Pre-authorize payments securely on Solana and pay only for your
            actual call duration.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 glow-primary text-lg px-8"
            >
              <Link href="/experts">
                Find an Expert
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 bg-transparent"
            >
              <Link href="/how-it-works">
                <Play className="mr-2 w-5 h-5" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold gradient-text">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Expert Consultants
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold gradient-text">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Calls Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold gradient-text">100%</span>
              </div>
              <p className="text-sm text-muted-foreground">Secure Payments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
