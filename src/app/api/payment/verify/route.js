import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import AgentProfile from "@/models/AgentProfile";
import { getAuthUser } from "@/lib/getAuthUser";
import { activateSubscription } from '@/lib/activateSubscription';

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


  const { agent } = await activateSubscription(user);


  return NextResponse.json({
    success: true,
    agentProfileId: agent._id,
  });
}