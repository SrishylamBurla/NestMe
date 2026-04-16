import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB();

    const tickets = await Support.find()
      .populate("user", "name email") // ✅ based on your frontend
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(tickets || []);
  } catch (error) {
    console.error("ADMIN SUPPORT ERROR:", error);

    return NextResponse.json([]);
  }
}