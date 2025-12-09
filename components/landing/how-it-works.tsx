import { SolanaLogo } from "@/components/solana-logo";

const steps = [
  {
    number: "01",
    title: "Browse & Select",
    description:
      "Explore verified experts across various Web3 specializations. View profiles, ratings, and availability.",
  },
  {
    number: "02",
    title: "Book a Slot",
    description:
      "Choose a 20-minute time slot that works for you. See the cost preview based on the expert's rate.",
  },
  {
    number: "03",
    title: "Pre-Authorize Payment",
    description:
      "Approve a spending limit from your Solana wallet. Funds stay in your wallet until the call ends.",
  },
  {
    number: "04",
    title: "Join the Call",
    description:
      "Connect via HD video with your expert. A timer tracks the duration in real-time.",
  },
  {
    number: "05",
    title: "Pay & Review",
    description:
      "Only pay for the actual minutes used. Rate your experience and the expert keeps 95%.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <SolanaLogo className="w-6 h-6" />
            <span className="text-sm text-primary font-medium">
              Powered by Solana
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="gradient-text">DialExperts</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A seamless micro-consultation experience powered by Solana delegate
            approvals.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="w-16 h-16 mx-auto rounded-full bg-card border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                  <span className="text-xl font-bold gradient-text">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
