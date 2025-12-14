import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { UserRole } from "@prisma/client";
import { generateToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const walletAddress = formData.get("walletAddress") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    if (!walletAddress || !name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if wallet exists
    const existingWallet = await prisma.user.findFirst({
      where: { walletAddress },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Wallet address already registered" },
        { status: 409 }
      );
    }

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    if (role === "expert") {
      const field = formData.get("field") as string;
      const bio = formData.get("bio") as string;
      const ratePerMinStr = formData.get("ratePerMin") as string;
      const cvFile = formData.get("cv") as File | null;
      const certificateFile = formData.get("certificate") as File | null;

      if (!field || !bio || !ratePerMinStr) {
        return NextResponse.json(
          { error: "Missing required expert fields" },
          { status: 400 }
        );
      }

      // Upload files
      let cvUrl = null;
      let certificateUrl = null;

      if (cvFile && cvFile.size > 0) {
        cvUrl = await uploadToCloudinary(cvFile, "dialexperts/resumes");
      }
      if (certificateFile && certificateFile.size > 0) {
        certificateUrl = await uploadToCloudinary(
          certificateFile,
          "dialexperts/certificates"
        );
      }

      // Create expert
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          walletAddress,
          role: role as UserRole,
          expertProfile: {
            create: {
              field,
              bio,
              ratePerMin: parseInt(ratePerMinStr, 10),
              status: "pending",
              availability: {},
              cvUrl,
              certificateUrl,
            },
          },
        },
        include: {
          expertProfile: true,
        },
      });

      const token = generateToken(
        newUser.id,
        newUser.walletAddress!,
        newUser.role
      );

      // Set token in httpOnly cookie
      (await cookies()).set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json(
        {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            walletAddress: newUser.walletAddress,
            createdAt: newUser.createdAt,
          },
          expert: newUser.expertProfile,
          message: "Expert application submitted successfully",
        },
        { status: 201 }
      );
    } else {
      // Create regular user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          walletAddress,
          role: role as UserRole,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          walletAddress: true,
          createdAt: true,
        },
      });

      const token = generateToken(
        newUser.id,
        newUser.walletAddress!,
        newUser.role
      );

      // Set token in httpOnly cookie
      (await cookies()).set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json(
        {
          user: newUser,
          message: "Account created successfully",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
