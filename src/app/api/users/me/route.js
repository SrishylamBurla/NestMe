import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT(req) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, phone } = await req.json();

    // Check if phone belongs to another user
    if (phone) {
      const existingUser = await User.findOne({
        phone,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            message:
              "This phone number is already registered with another account",
          },
          { status: 400 }
        );
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;

    await user.save();

    return NextResponse.json({
      message: "Profile updated",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}