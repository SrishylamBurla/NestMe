import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import AgentProfile from "@/models/AgentProfile";

export async function GET(req, context) {
  await connectDB();

  const { agentId } = await context.params;

  /* ================= VALIDATE ID ================= */

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return Response.json(
      { message: "Invalid Agent ID" },
      { status: 400 }
    );
  }

  /* ================= GET AGENT PROFILE ================= */

  const agentProfile = await AgentProfile.findById(agentId);

  if (!agentProfile) {
    return Response.json(
      { message: "Agent not found" },
      { status: 404 }
    );
  }

  const userId = agentProfile.user;

  /* ================= FETCH PROPERTIES ================= */

  const properties = await Property.find({
    $or: [
      { agent: agentId }, // listed as agent
      { owner: userId },  // owned before becoming agent
    ],
    approvalStatus: "approved",
  }).sort({ createdAt: -1 });

  return Response.json({ properties });
}