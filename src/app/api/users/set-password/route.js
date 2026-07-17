import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const { password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          message:
            "Password and Confirm Password are required.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    // User already has a password
    if (user.password) {
      return NextResponse.json(
        {
          message:
            "Password already exists. Please use Change Password.",
        },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);

    // Keep Google as the provider so Google login still works.
    if (!user.loginProvider) {
      user.loginProvider = "google";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password created successfully.",
    });

  } catch (err) {
    console.error("SET PASSWORD ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
      },
      { status: 500 }
    );
  }
}