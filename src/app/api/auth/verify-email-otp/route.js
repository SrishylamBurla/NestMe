import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { email, otp } = await req.json();

  const user = await User.findOne({ email });

  if (
    !user ||
    user.emailOTP !== otp ||
    user.emailOTPExpiry < Date.now()
  ) {
    return NextResponse.json(
      { message: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  user.emailOTP = undefined;
  user.emailOTPExpiry = undefined;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    id: user._id,
    name: user.name,
    role: user.role,
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}