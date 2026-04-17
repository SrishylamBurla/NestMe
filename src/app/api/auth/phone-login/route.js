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

const normalizePhone = (phone) => {
  return phone.replace(/\D/g, "").slice(-10);
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    let { phone, email } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
        { status: 400 }
      );
    }

    phone = normalizePhone(phone);

    console.log("NORMALIZED PHONE:", phone);

    let user;

    // 🔥 STEP 1: Find by phone
    user = await User.findOne({ phone });

    // 🔥 STEP 2: If NOT found → try merge with email
    if (!user && email) {
      user = await User.findOne({ email });

      if (user) {
        user.phone = phone;
        user.loginProvider = "phone";
        await user.save();
      }
    }

    // 🔥 STEP 3: If still NOT found → create new
    if (!user) {
      user = await User.create({
        phone,
        name: "User",
        role: "user",
        loginProvider: "phone",
      });
    }

    // 🔥 STEP 4: Generate token AFTER final user
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