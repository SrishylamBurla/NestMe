import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req, { params }) {
  await connectDB();
  const user = await getAuthUser();

  const leads = await Lead.find({ fromUser: user._id })
    .populate("property", "title city images")
    .populate("agent");

  return NextResponse.json({ leads });
}
