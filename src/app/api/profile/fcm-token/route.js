import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fcmToken } = await req.json();

    if (!fcmToken) {
      return NextResponse.json(
        { message: "FCM token is required" },
        { status: 400 }
      );
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
    console.error(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}