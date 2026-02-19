import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();

  const notifications = await Notification.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  return NextResponse.json(notifications);
}
