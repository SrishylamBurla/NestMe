import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { message: "Token required" },
      { status: 400 }
    );
  }

  // 🔥 Save token (avoid duplicates)
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { pushTokens: token },
  });

  return NextResponse.json({ success: true });
}