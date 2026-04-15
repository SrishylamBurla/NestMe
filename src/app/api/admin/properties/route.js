import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  await connectDB();
  const properties = await Property.find().populate("owner agent");
  return NextResponse.json({ properties });
}
