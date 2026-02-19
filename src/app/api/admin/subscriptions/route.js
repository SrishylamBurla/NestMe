import Subscription from "@/models/Subscription";
import connectDB from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const subscriptions = await Subscription.find().populate("user");
  return NextResponse.json({ subscriptions });
}
