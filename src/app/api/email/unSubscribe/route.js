import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Invalid link" }, { status: 400 });
  }

  await User.findOneAndUpdate(
    { email },
    { emailSubscribed: false }
  );

  return NextResponse.redirect(
    `${process.env.CLIENT_URL}/unsubscribe-success`
  );
}
