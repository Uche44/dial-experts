import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// verify JWT token
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyAuth();

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        expert: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure the user is part of this booking (either as user or expert)
    // We need to check if the current user is the one who booked or the expert
    // For now, assuming payload.userId matches booking.userId is enough for the user side
    // But for completeness, we should allow experts too.
    // However, since we don't have expertId in payload directly (it's userId), we check against booking.userId or booking.expert.userId

    if (
      booking.userId !== payload.userId &&
      booking.expert.userId !== payload.userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized access to this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
