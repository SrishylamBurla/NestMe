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

    // ✅ parse ONCE
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.log("BODY:", body);

    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ phone });

    // ✅ create user if not exists
    if (!user) {
      user = await User.create({
        phone,
        name: "User",
        role: "user",
      });
    }

    const token = generateToken(user._id);

    // ✅ set cookie (correct way)
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax", // 🔥 important
    });

    return NextResponse.json({
      id: user._id,
      token,
    });

  } catch (err) {
    console.error("PHONE LOGIN ERROR FULL:", err);

    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}