// import crypto from "crypto";
// import connectDB from "@/lib/db";
// import User from "@/models/User";

// export async function POST(req) {
//   await connectDB();

//   const { email } = await req.json();

//   const user = await User.findOne({ email });
//   if (!user) return Response.json({ message: "User not found" });

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetToken = token;
//   user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
//   await user.save();

//   // 👉 Send email with reset link
//   const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

//   console.log("Reset link:", resetLink);

//   return Response.json({ message: "Reset link sent" });
// }

import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  // send email here

  return NextResponse.json({ message: "Reset OTP sent" });
}