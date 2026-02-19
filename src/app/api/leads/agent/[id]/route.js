import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

export async function GET(req, { params }) {
  await connectDB();

  const leads = await Lead.find({ agent: params.id })
    .populate("property fromUser");

  return NextResponse.json({ leads });
}
