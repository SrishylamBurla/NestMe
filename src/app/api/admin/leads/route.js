import Lead from "@/models/Lead";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import "@/models/AgentProfile";
import "@/models/Property";
import "@/models/User";

export async function GET() {
  await connectDB();
  const leads = await Lead.find()
    .populate("property")
    .populate("user", "name email")
    .populate({
      path: "agent",
      populate: {
        path: "user",
        select: "name email phone",
      },
    });
  return NextResponse.json({ leads });
}
