import { NextResponse } from "next/server";
import { sendNotification } from "@/lib/socket";

export async function POST(req) {
  const { userId } = await req.json();

  sendNotification(userId, {
    title: "Test Notification",
    message: "Socket is working!",
    type: "test",
    createdAt: new Date(),
  });

  return NextResponse.json({
    success: true,
    message: "Notification sent",
  });
}