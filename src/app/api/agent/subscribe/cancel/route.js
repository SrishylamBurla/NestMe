import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST() {
  await connectDB();

  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const subscription = await Subscription.findOne({
    user: user._id,
    status: "active",
  });

  if (!subscription) {
    return NextResponse.json(
      { message: "No active subscription" },
      { status: 404 }
    );
  }

  // Cancel subscription
  subscription.status = "cancelled";
  await subscription.save();

  // 🔥 IMMEDIATE DOWNGRADE
  user.role = "user";
  user.agentProfileId = null;
  await user.save();

  return NextResponse.json({
    message: "Subscription cancelled. You are now a normal user.",
  });
}