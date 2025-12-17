import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          platformFeePercentage: 5.0,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platformFeePercentage, minCallDuration, maxCallDuration } = body;

    if (
      typeof platformFeePercentage !== "number" ||
      typeof minCallDuration !== "number" ||
      typeof maxCallDuration !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid settings values" },
        { status: 400 }
      );
    }

    let settings = await prisma.systemSettings.findFirst();
    if (settings) {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          platformFeePercentage,
          minCallDuration,
          maxCallDuration,
        },
      });
    } else {
      settings = await prisma.systemSettings.create({
        data: {
          platformFeePercentage,
          minCallDuration,
          maxCallDuration,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
