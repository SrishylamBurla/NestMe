import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointments";

export async function GET(req, { params }) {
  await connectDB();

  const { agentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return NextResponse.json({ message: "Invalid agent id" }, { status: 400 });
  }

  const appointments = await Appointment.find({
    agent: agentId,
    status: "scheduled",
  })
    .populate("lead", "name phone")
    .populate("property", "title city")
    .sort({ date: 1 })
    .limit(5);

  return NextResponse.json({ appointments });
}
