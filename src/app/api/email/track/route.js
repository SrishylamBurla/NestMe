import connectDB from "@/lib/db";
import EmailLog from "@/models/EmailLog";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (email) {
    await EmailLog.create({
      email,
      openedAt: new Date(),
    });
  }

  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    "base64"
  );

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
    },
  });
}
