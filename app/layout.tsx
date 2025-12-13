import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AppKitProvider } from "@/context/appkit-provider";
import ExpertsProvider from "@/context/experts-context";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DialExperts - Web3 Expert Consultation Platform",
  description:
    "Connect with blockchain experts instantly. Pay only for what you use with Solana delegate approvals.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
         
          <ExpertsProvider>
            <AppKitProvider>{children}</AppKitProvider>
             <Toaster />
          </ExpertsProvider>
         
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
