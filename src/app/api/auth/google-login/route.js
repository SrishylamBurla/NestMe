import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export async function POST(req) {
  try {
    await connectDB();

    const { email, name, image } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    // 🔥 STEP 1: Check existing user
    let user = await User.findOne({ email });

    // 🔥 STEP 2: Create only if not exists
    if (!user) {
      user = await User.create({
        email,
        name: name || "User",
        avatar: image,
        loginProvider: "google",
      });
    }

    // 🔥 STEP 3: Generate token
    const token = generateToken(user._id);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      id: user._id,
      token,
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err); // 👈 IMPORTANT

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}