import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // prevent duplicates
    const exists = await Newsletter.findOne({ email });

    if (exists) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 400 }
      );
    }

    await Newsletter.create({ email });

    return NextResponse.json({
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}