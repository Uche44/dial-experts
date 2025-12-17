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

    // Get or create system settings
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          platformFeePercentage: 5.0,
        },
      });
    }

    const [
      pendingExperts,
      totalUsers,
      activeExperts,
      totalRevenueResult,
      totalCalls,
      totalExperts,
      totalTransactions,
      platformFeesResult,
    ] = await Promise.all([
      prisma.expertProfile.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { role: "user" } }),
      prisma.expertProfile.count({ where: { status: "approved" } }),
      prisma.booking.aggregate({
        _sum: { cost: true },
        where: { status: "completed" },
      }),
      prisma.booking.count({ where: { status: "completed" } }),
      prisma.expertProfile.count(),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: { platformFee: true },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.cost || 0;
    const platformFees = platformFeesResult._sum.platformFee || 0;

    return NextResponse.json({
      pendingExperts,
      totalUsers,
      activeExperts,
      totalRevenue,
      platformFees,
      totalCalls,
      totalExperts,
      totalTransactions,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
