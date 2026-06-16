// app/api/auth/me/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AgentProfile from "@/models/AgentProfile";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Subscription from "@/models/Subscription";

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

    const user = await User.findById(decoded.id);

if (!user) {
  return NextResponse.json({ user: null });
}

const subscription = await Subscription.findOne({
  user: user._id,
});

if (
  subscription &&
  subscription.endDate &&
  new Date(subscription.endDate) < new Date()
) {
  subscription.status = "expired";
  await subscription.save();

  if (user.role === "agent") {
    user.role = "user";
    await user.save();
  }
}

    let agentProfileId = null;

    if (user.role === "agent") {
      const profile = await AgentProfile.findOne({ user: user._id }).select("_id");
      agentProfileId = profile?._id || null;
    }

    const userData = user.toObject();
    return NextResponse.json({
      user: {
        ...userData,
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