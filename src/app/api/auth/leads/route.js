import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const myProperties = await Property.find({ owner: user._id }).select("_id");

  const leads = await Lead.find({
    property: { $in: myProperties.map(p => p._id) }
  })
    .populate("user", "name email phone")
    .populate("property", "title")
    .sort({ createdAt: -1 });

  return NextResponse.json({ leads });
}
