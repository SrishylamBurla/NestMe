import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { userId, title, body, url } = await req.json();

  try {
    const user = await User.findById(userId);

    if (!user || !user.pushTokens?.length) {
      return NextResponse.json(
        { message: "No tokens found" },
        { status: 404 }
      );
    }

    const messages = user.pushTokens.map((token) => ({
      to: token,
      title,
      body,
      data: { url },
    }));

    const response = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}