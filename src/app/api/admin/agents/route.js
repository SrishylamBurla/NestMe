import AgentProfile from "@/models/AgentProfile";
import connectDB from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const agents = await AgentProfile.find().populate("user", "name email");
  return NextResponse.json({ agents });
}

export async function PUT(req) {
  const { agentId, verified } = await req.json();
  await AgentProfile.findByIdAndUpdate(agentId, { verified });
  return NextResponse.json({ message: "Agent updated" });
}
