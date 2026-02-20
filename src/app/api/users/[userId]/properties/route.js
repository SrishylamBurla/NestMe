import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDB();

  const { userId } = params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const properties = await Property.find({
    owner: userId,
    approvalStatus: "approved",
  });

  return NextResponse.json({ properties });
}
