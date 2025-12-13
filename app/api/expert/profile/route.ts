import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

// Helper function to verify JWT token
async function verifyAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token.value as string, JWT_SECRET as string) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET - Fetch current expert's profile
export async function GET() {
  try {
    const userId = await verifyAuth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch user and expert profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        expertProfile: true
      }
    })

    if (!user || user.role !== "expert" || !user.expertProfile) {
      return NextResponse.json(
        { error: "Expert profile not found" },
        { status: 404 }
      )
    }

    const expert = user.expertProfile

    // Transform to match the Expert type
    const transformedExpert = {
      id: expert.id,
      userId: expert.userId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar
      },
      field: expert.field,
      ratePerMin: expert.ratePerMin,
      bio: expert.bio,
      // availability: expert.availability || [],
      availability: expert.availability,
      status: expert.status,
      rating: 4.8,
      totalReviews: 0,
      completedCalls: 0,
      totalEarnings: 0
    }

    return NextResponse.json(transformedExpert)
  } catch (error) {
    console.error("Error fetching expert profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch expert profile" },
      { status: 500 }
    )
  }
}

//Update expert profile
export async function PUT(request: Request) {
  try {
    const userId = await verifyAuth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, field, bio, ratePerMin, avatar, availability } = body

    // Validate required fields (only if they're being updated)
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Update user details if provided
    if (name || email || avatar) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(avatar && { avatar })
        }
      })
    }

    // Prepare expert profile update data
    const expertUpdateData: any = {}
    if (field) expertUpdateData.field = field
    if (bio) expertUpdateData.bio = bio
    if (ratePerMin) expertUpdateData.ratePerMin = parseInt(ratePerMin)
    if (availability !== undefined) expertUpdateData.availability = availability

    // Update expert profile
    const updatedExpert = await prisma.expertProfile.update({
      where: { userId: userId },
      data: expertUpdateData,
      include: {
        user: true
      }
    })

    // Transform the data to match the Expert type structure
    const transformedExpert = {
      id: updatedExpert.id,
      userId: updatedExpert.userId,
      user: {
        id: updatedExpert.user.id,
        name: updatedExpert.user.name,
        email: updatedExpert.user.email,
        walletAddress: updatedExpert.user.walletAddress,
        role: updatedExpert.user.role,
        createdAt: updatedExpert.user.createdAt,
        avatar: updatedExpert.user.avatar
      },
      field: updatedExpert.field,
      ratePerMin: updatedExpert.ratePerMin,
      bio: updatedExpert.bio,
      availability: updatedExpert.availability,
      status: updatedExpert.status,
      rating: 4.8,
      totalReviews: 0,
      completedCalls: 0,
      totalEarnings: 0
    }

    return NextResponse.json(transformedExpert)
  } catch (error) {
    console.error("Error updating expert profile:", error)
    return NextResponse.json(
      { error: "Failed to update expert profile" },
      { status: 500 }
    )
  }
}

