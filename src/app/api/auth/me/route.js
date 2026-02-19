// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AgentProfile from "@/models/AgentProfile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).lean();
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  let agentProfileId = null;

  if (user.role === "agent") {
    const profile = await AgentProfile.findOne({ user: user._id }).select("_id");
    agentProfileId = profile?._id || null;
  }

  return NextResponse.json({ ...user, agentProfileId });
}
