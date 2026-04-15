import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { token, userId } = await req.json();

if (!token || !userId) {
  return NextResponse.json(
    { message: "Token and userId required" },
    { status: 400 }
  );
}

  // 🔥 Save token (avoid duplicates)
  await User.findByIdAndUpdate(userId, {
    $addToSet: { pushTokens: token },
  });

  return NextResponse.json({ success: true });
}