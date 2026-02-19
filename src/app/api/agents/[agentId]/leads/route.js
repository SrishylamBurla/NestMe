import mongoose from "mongoose";
import Lead from "@/models/Lead";
import AgentProfile from "@/models/AgentProfile";
import { getAuthUser } from "@/lib/getAuthUser";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import Notification from "@/models/Notification";


export async function GET(req, context) {
  const { agentId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return Response.json({ message: "Invalid Agent ID" }, { status: 400 });
  }

const authUser = await getAuthUser();

const agentProfile = await AgentProfile.findOne({ user: authUser._id });

if (!agentProfile || agentProfile._id.toString() !== agentId) {
  return Response.json({ message: "Forbidden" }, { status: 403 });
}


  const leads = await Lead.find({ agent: agentId })
    .populate("user", "name email")
    .populate("property", "title priceLabel city images")
    .sort({ createdAt: -1 });

  return Response.json({ leads });
}



export async function POST(req, context) {
  try {
    await connectDB();

    const { agentId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json(
        { message: "Invalid Agent ID" },
        { status: 400 }
      );
    }

    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { propertyId, name, email, phone, message } = body;

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    const lead = await Lead.create({
      property: propertyId,
      agent: agentId,
      owner: property.owner,
      user: authUser._id,
      name,
      email,
      phone,
      message,
    });

    // increment property lead count
    await Property.findByIdAndUpdate(propertyId, {
      $inc: { leadsCount: 1 },
    });

    // notification
    await Notification.create({
  user: authUser._id,
  title: "New Lead Created",
  message: `Lead created for "${property.title}"`,
  type: "lead-received",
  link: `/agents/${agentId}/leads`,
});


    return NextResponse.json({ lead }, { status: 201 });

  } catch (error) {
    console.error("AGENT CREATE LEAD ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
