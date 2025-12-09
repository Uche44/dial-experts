import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 lg:pl-64">{children}</main>
    </div>
  )
}
