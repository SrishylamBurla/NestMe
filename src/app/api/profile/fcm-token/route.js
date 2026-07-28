import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  try {
    console.log("====== FCM API ======");

    await connectDB();

    const user = await getAuthUser();
    console.log("USER:", user?._id);

    const body = await req.json();
    console.log("BODY:", body);

    const { fcmToken } = body;

    if (!fcmToken) {
      return NextResponse.json(
        { message: "FCM token is required" },
        { status: 400 },
      );
    }

    if (!user.fcmTokens) {
      user.fcmTokens = [];
    }

    if (!user.fcmTokens.includes(fcmToken)) {
      user.fcmTokens.push(fcmToken);
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "FCM token saved",
    });
  } catch (err) {
    console.error("FCM ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}
