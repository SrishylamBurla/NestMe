import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, otp, newPassword } = await req.json();

  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetOTP !== otp ||
    user.resetOTPExpiry < Date.now()
  ) {
    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);

  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;

  await user.save();

  return NextResponse.json({
    message: "Password updated",
  });
}