import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();

  const properties = await Property.find({ createdBy: user._id });
  return NextResponse.json({ properties });
}
