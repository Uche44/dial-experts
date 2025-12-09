import type React from "react"
import { ExpertSidebar } from "@/components/expert/sidebar"

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <ExpertSidebar />
      <main className="flex-1 lg:pl-64">{children}</main>
    </div>
  )
}
