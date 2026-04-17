// app/api/auth/me/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AgentProfile from "@/models/AgentProfile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 🔥 consistent response
    if (!token) {
      return NextResponse.json({ user: null });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ user: null });
    }

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    let agentProfileId = null;

    if (user.role === "agent") {
      const profile = await AgentProfile.findOne({ user: user._id }).select("_id");
      agentProfileId = profile?._id || null;
    }

    return NextResponse.json({
      user: {
        ...user,
        agentProfileId,
      },
    });

  } catch (err) {
    console.error("ME API ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}