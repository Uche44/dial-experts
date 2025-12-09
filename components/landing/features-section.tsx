import { Wallet, Clock, Video, Shield, Coins, Users } from "lucide-react"

const features = [
  {
    icon: Wallet,
    title: "Delegate Approvals",
    description: "Pre-authorize spending without moving funds. Your tokens stay in your wallet until the call ends.",
  },
  {
    icon: Clock,
    title: "Pay Per Minute",
    description: "Only pay for the actual call duration. Unused pre-authorized funds are never touched.",
  },
  {
    icon: Video,
    title: "HD Video Calls",
    description: "Crystal clear video consultations with screen sharing and real-time collaboration.",
  },
  {
    icon: Shield,
    title: "Secure & Trustless",
    description: "Smart contract escrow ensures fair payments. No intermediaries, no disputes.",
  },
  {
    icon: Coins,
    title: "Low Fees",
    description: "Only 5% platform fee. Experts keep 95% of their earnings with instant Solana payouts.",
  },
  {
    icon: Users,
    title: "Verified Experts",
    description: "All experts are vetted and verified. See ratings, reviews, and expertise areas.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built for the <span className="gradient-text">Future of Consulting</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging Solana&apos;s speed and security to create a seamless consultation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
