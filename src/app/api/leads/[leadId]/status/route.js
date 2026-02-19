import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT(req, context) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { leadId } = await context.params;
    const { status } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return NextResponse.json(
        { message: "Invalid lead id" },
        { status: 400 }
      );
    }

    // IMPORTANT: populate property
    const lead = await Lead.findById(leadId)
      .populate("property");

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    //  Agent check
    const isAgent =
      user.agentProfileId &&
      user.agentProfileId.toString() === lead.agent?.toString();

    //  Owner check
    const isOwner =
      lead.property?.owner?.toString() === user._id.toString();

    if (!isAgent && !isOwner) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    lead.status = status;
    await lead.save();

    return NextResponse.json({
      message: "Status updated",
      lead,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
