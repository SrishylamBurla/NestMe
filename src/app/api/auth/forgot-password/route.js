 import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    
 const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your NestMe password",
    html: `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Reset Password</h2>
      <p>You requested a password reset.</p>
      <a href="${resetLink}" 
         style="display:inline-block;padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
      <p style="margin-top:10px;">This link expires in 10 minutes.</p>
    </div>
  `,
  });

    return NextResponse.json({
      message: "Reset link sent to your email",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
 
 