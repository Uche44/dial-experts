import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";

// Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID;

const metadata = {
  name: "AppKit",
  description: "DialExperts",
  url: "https://example.com", 
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const appKit = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
  },
});
