import Lead from "@/models/Lead";
import connectDB from "@/lib/db"
import { NextResponse } from "next/server";
import "@/models/AgentProfile"
import "@/models/Property"
import "@/models/User"


export async function GET() {
  await connectDB();
  const leads = await Lead.find().populate("property agent user");
  return NextResponse.json({ leads });
}
