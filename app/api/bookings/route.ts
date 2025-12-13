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

// new booking
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth();

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { expertId, slotStart, slotEnd } = body;

    if (!expertId || !slotStart || !slotEnd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log('Prisma client:', prisma ? 'OK' : 'UNDEFINED');

    // check slot is in the future
    const slotStartDate = new Date(slotStart);
    const slotEndDate = new Date(slotEnd);
    const now = new Date();

    if (slotStartDate <= now) {
      return NextResponse.json(
        { error: "Cannot book slots in the past" },
        { status: 400 }
      );
    }

    // expert profile to check availability and rate
    const expert = await prisma.expertProfile.findUnique({
      where: { id: expertId },
      include: { user: true }
    });

    if (!expert) {
      return NextResponse.json(
        { error: "Expert not found" },
        { status: 404 }
      );
    }

    // Check if the time slot is within expert's availability
    const dayName = slotStartDate.toLocaleDateString("en-US", { weekday: "long" });
    const availability = expert.availability as any;
    
    if (!availability || !availability[dayName]) {
      return NextResponse.json(
        { error: "Expert is not available on this day" },
        { status: 400 }
      );
    }

    const dayAvailability = availability[dayName];
    const slotTime = slotStartDate.toTimeString().slice(0, 5); // HH:MM format
    
    if (slotTime < dayAvailability.startTime || slotTime >= dayAvailability.endTime) {
      return NextResponse.json(
        { error: "Time slot is outside expert's available hours" },
        { status: 400 }
      );
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        expertId: expertId,
        status: {
          in: ["pending", "confirmed", "in-progress"]
        },
        OR: [
          {
            AND: [
              { slotStart: { lte: slotStartDate } },
              { slotEnd: { gt: slotStartDate } }
            ]
          },
          {
            AND: [
              { slotStart: { lt: slotEndDate } },
              { slotEnd: { gte: slotEndDate } }
            ]
          },
          {
            AND: [
              { slotStart: { gte: slotStartDate } },
              { slotEnd: { lte: slotEndDate } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Calculate cost (20 minutes session)
    const durationMinutes = 20;
    const cost = expert.ratePerMin * durationMinutes;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: payload.userId,
        expertId: expertId,
        slotStart: slotStartDate,
        slotEnd: slotEndDate,
        cost: cost,
        status: "confirmed"
      },
      include: {
        user: true,
        expert: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// GET - Get user's bookings
export async function GET(request: Request) {
  try {
    const payload = await verifyAuth();

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: any = {
      userId: payload.userId
    };

    if (status) {
      const statusArray = status.split(",");
      whereClause.status = { in: statusArray };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        expert: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        slotStart: "asc"
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
