import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req) {
  await connectDB();
  const user = await getAuthUser();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    user: user._id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return NextResponse.json(notifications);
}
