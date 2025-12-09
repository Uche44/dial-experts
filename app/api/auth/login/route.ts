import { NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"
import type { UserRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    // In a real app, we would hash and compare passwords
    let user = mockUsers.find((u) => u.email === email)

    // For demo purposes, if specific role is requested and user not found by email, try to find by role
    // This maintains the existing demo behavior
    if (!user && role) {
      user = mockUsers.find((u) => u.role === role)
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user data (excluding sensitive info in a real app)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
