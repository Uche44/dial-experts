import Link from "next/link"
import { SolanaLogo } from "./solana-logo"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <SolanaLogo className="w-8 h-8" />
              <span className="text-xl font-bold gradient-text">DialExperts</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connect with Web3 experts instantly. Pay only for what you use with Solana delegate approvals.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/experts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore Experts
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/signup?role=expert"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become an Expert
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/delegate-approval"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Delegate Approvals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 DialExperts. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <SolanaLogo className="w-4 h-4" />
            <span className="gradient-text font-medium">Solana</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
