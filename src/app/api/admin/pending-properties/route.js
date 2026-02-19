import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Property from "@/models/Property";

export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user || user.role !== "admin")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const properties = await Property.find({ approvalStatus: "pending" })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json({ properties });
}
