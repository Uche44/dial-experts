import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Join the future of consulting</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Connect with <span className="gradient-text">Top Experts?</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Whether you&apos;re building a Web3 project or want to share your expertise, DialExperts is the platform for
          you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow-primary text-lg px-8">
            <Link href="/signup">
              Start as a User
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
            <Link href="/signup?role=expert">Become an Expert</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
