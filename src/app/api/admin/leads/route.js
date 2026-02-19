import Lead from "@/models/Lead";
import connectDB from "@/lib/db"
import { NextResponse } from "next/server";


export async function GET() {
  await connectDB();
  const leads = await Lead.find().populate("property agent user");
  return NextResponse.json({ leads });
}
