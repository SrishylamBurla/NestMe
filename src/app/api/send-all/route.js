import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { title, body, url } = await req.json();

  try {
    const users = await User.find({ pushTokens: { $exists: true, $ne: [] } });

    let messages = [];

    users.forEach((user) => {
      user.pushTokens.forEach((token) => {
        messages.push({
          to: token,
          title,
          body,
          data: { url },
        });
      });
    });

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