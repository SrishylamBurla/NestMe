import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import AgentProfile from "@/models/AgentProfile";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // ✅ MAKE USER AGENT
  user.role = "agent";

  // ✅ CREATE AGENT PROFILE IF NOT EXISTS
  let agent = await AgentProfile.findOne({ user: user._id });

  if (!agent) {
    agent = await AgentProfile.create({
      user: user._id,
    });
  }

  user.agentProfileId = agent._id;

  // ✅ CREATE SUBSCRIPTION (🔥 THIS WAS MISSING)
 const subscription = await Subscription.create({
  user: user._id,
  plan: "basic",
  price: 999,
  status: "active",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});

  user.subscriptionId = subscription._id;
  await user.save();

  return NextResponse.json({
    success: true,
    agentProfileId: agent._id,
  });
}