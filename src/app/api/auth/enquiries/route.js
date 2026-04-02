import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const enquiries = await Lead.find({ user: user._id })
    .populate("property", "title")
    .populate({
      path: "agent",
      populate: { path: "user", select: "name email" },
    })
    .sort({ createdAt: -1 });

  return NextResponse.json({ enquiries });
}
