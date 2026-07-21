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
    status: 'active'
  })
    .sort({
      createdAt: -1
    });
  if (!subscription) {
    return NextResponse.json(
      { message: "No active subscription" },
      { status: 404 }
    );
  }

  // Cancel subscription
  await Subscription.updateMany({
    user: user._id,
    status: 'active'
  }, {
    $set: {
      status: 'cancelled'
    }
  });

  // 🔥 IMMEDIATE DOWNGRADE
  user.role='user';

user.subscriptionId=null;

await user.save();

  return NextResponse.json({
  success: true,
  message: "Subscription cancelled successfully.",
  user: {
    role: user.role,
    agentProfileId: user.agentProfileId,
    subscriptionId: user.subscriptionId,
  },
});
}