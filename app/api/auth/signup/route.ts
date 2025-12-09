import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    // Optional file
    // const avatarFile = formData.get("avatar") as File | null;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let avatarUrl = null;

    // Upload avatar if provided
    // if (avatarFile && avatarFile.size > 0) {
    //   try {
    //     avatarUrl = await uploadToCloudinary(avatarFile, "dialexperts/avatars");
    //   } catch (uploadError) {
    //     console.error("Avatar upload failed:", uploadError);

    //   }
    // }

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

      // Upload Expert documents
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

      // Create user with expert profile in a transaction
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "expert",
          avatar: avatarUrl,
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

      return NextResponse.json(
        {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
            createdAt: newUser.createdAt,
          },
          expert: newUser.expertProfile,
          message: "Application submitted successfully",
        },
        { status: 201 }
      );
    } else {
      // Regular user signup
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "user",
          avatar: avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
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
