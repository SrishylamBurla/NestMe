import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  if (!email)
    return NextResponse.json(
      { message: "Email required" },
      { status: 400 }
    );

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOneAndUpdate(
    { email, phone },
    {
      emailVerificationOTP: otp,
      emailVerificationExpiry: Date.now() + 10 * 60 * 1000, 
    //   phoneOTP: otp,
    //   phoneOTPExpiry: Date.now() + 10 * 60 * 1000,
    },
    { returnDocument: "after", upsert: true }
  );

  await sendEmail(email, "NestMe OTP", `Your OTP is ${otp}`);

  return NextResponse.json({ message: "OTP sent" });
}