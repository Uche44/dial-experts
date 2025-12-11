import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Check if user with this wallet exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletAddress: true,
        avatar: true,
        createdAt: true,
        expertProfile: {
          select: {
            field: true,
            bio: true,
            cvUrl: true,
            certificateUrl: true,
            ratePerMin: true,
            status: true,
          },
        },
      },
    });

    if (user) {
      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          avatar: user.avatar,
          createdAt: user.createdAt,
          expertProfile: user.expertProfile,
        },
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Check wallet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
