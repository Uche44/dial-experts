import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch all approved experts with their user details
    const experts = await prisma.expertProfile.findMany({
      where: {
        status: "pending"
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Transform the data to match the Expert type structure
    const transformedExperts = experts.map((expert: any) => ({
      id: expert.id,
      userId: expert.userId,
      user: {
        id: expert.user.id,
        name: expert.user.name,
        email: expert.user.email,
        walletAddress: expert.user.walletAddress,
        role: expert.user.role,
        createdAt: expert.user.createdAt,
        avatar: expert.user.avatar
      },
      field: expert.field,
      ratePerMin: expert.ratePerMin,
      bio: expert.bio,
      availability: expert.availability,
      status: expert.status,
      // These fields can be calculated later or set to defaults for now
      rating: 0,
      totalReviews: 0,
      completedCalls: 0,
      totalEarnings: 0
    }))

    return NextResponse.json(transformedExperts)
  } catch (error) {
    console.error("Error fetching experts:", error)
    return NextResponse.json(
      { error: "Failed to fetch experts" },
      { status: 500 }
    )
  }
}
