import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT() {
  await connectDB();

  const user = await getAuthUser();

  await Notification.updateMany(
    {
      user: user._id,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  return NextResponse.json({
    success: true,
  });
}