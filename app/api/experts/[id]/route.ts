import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch expert profile with user details
    const expert = await prisma.expertProfile.findUnique({
      where: {
        id: id
      },
      include: {
        user: true
      }
    })

    if (!expert) {
      return NextResponse.json(
        { error: "Expert not found" },
        { status: 404 }
      )
    }

    // Transform the data to match the Expert type structure
    const transformedExpert = {
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
      availability: expert.availability || [],
      status: expert.status,
      // These fields can be calculated later or set to defaults for now
      rating: 4.8, // Default rating
      totalReviews: 0,
      completedCalls: 0,
      totalEarnings: 0
    }

    return NextResponse.json(transformedExpert)
  } catch (error) {
    console.error("Error fetching expert:", error)
    return NextResponse.json(
      { error: "Failed to fetch expert" },
      { status: 500 }
    )
  }
}
