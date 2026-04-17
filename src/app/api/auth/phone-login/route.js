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

// ✅ normalize function
const normalizePhone = (phone) => {
  return phone.replace(/\D/g, "").slice(-10); // last 10 digits only
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    let { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
        { status: 400 }
      );
    }

    // 🔥 FIX HERE
    phone = normalizePhone(phone);

    console.log("NORMALIZED PHONE:", phone);

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: "User",
        role: "user",
      });
    }

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
    console.error("PHONE LOGIN ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}