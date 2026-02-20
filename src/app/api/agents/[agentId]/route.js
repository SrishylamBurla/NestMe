import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import AgentProfile from "@/models/AgentProfile";

// import mongoose from "mongoose";
// import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import Property from "@/models/Property";
// import AgentProfile from "@/models/AgentProfile";
import { getAuthUser } from "@/lib/getAuthUser";


export async function GET(request, context) {
  await connectDB();

  // ✅ MUST AWAIT
  const { agentId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return NextResponse.json({ message: "Invalid agent id" }, { status: 400 });
  }

  const agent = await AgentProfile.findById(agentId)
    .populate("user", "name email")
    .lean();

  if (!agent) {
    return NextResponse.json({ message: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ agent });
}






export async function POST(req, { params }) {
  await connectDB();

  const { agentId } = params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return Response.json({ message: "Invalid Agent ID" }, { status: 400 });
  }

  const authUser = await getAuthUser();
  if (!authUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Ensure this agent owns this dashboard
  const agentProfile = await AgentProfile.findOne({ user: authUser._id });

  if (!agentProfile || agentProfile._id.toString() !== agentId) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const { propertyId, name, email, phone, message } = await req.json();

  const property = await Property.findOne({
    _id: propertyId,
    agent: agentId,
  });

  if (!property) {
    return Response.json(
      { message: "Property not found or not assigned to you" },
      { status: 404 }
    );
  }

  /* ---------------- CREATE LEAD ---------------- */
  const lead = await Lead.create({
    property: property._id,
    agent: agentId,
    owner: property.owner,
    name,
    email,
    phone,
    message,
    status: "new",
  });

  /* ---------------- INCREMENT LEAD COUNT ---------------- */
  await Property.findByIdAndUpdate(property._id, {
    $inc: { leadsCount: 1 },
  });

  return Response.json({ success: true, lead });
}
