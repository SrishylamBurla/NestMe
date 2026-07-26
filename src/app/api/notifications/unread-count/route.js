import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();

  const user = await getAuthUser();

  const count = await Notification.countDocuments({
    user: user._id,
    isRead: false,
  });

  return NextResponse.json({ count });
}