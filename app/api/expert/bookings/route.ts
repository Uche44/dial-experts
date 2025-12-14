import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// Helper function to verify JWT token
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token.value);
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Get expert's bookings
export async function GET(request: Request) {
  try {
    const payload = await verifyAuth();

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get expert profile for this user
    const expertProfile = await prisma.expertProfile.findUnique({
      where: { userId: payload.userId },
    });

    if (!expertProfile) {
      return NextResponse.json(
        { error: "Expert profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: any = {
      expertId: expertProfile.id,
    };

    if (status) {
      const statusArray = status.split(",");
      whereClause.status = { in: statusArray };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: true,
        call: true,
      },
      orderBy: {
        slotStart: "asc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching expert bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
