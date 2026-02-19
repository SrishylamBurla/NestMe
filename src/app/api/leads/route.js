import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.propertyId || !mongoose.Types.ObjectId.isValid(body.propertyId)) {
      return NextResponse.json(
        { message: "Valid propertyId is required" },
        { status: 400 },
      );
    }

    const property = await Property.findById(body.propertyId).populate({
      path: "agent",
      populate: { path: "user", select: "name email" },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }
    console.log("Incrementing leads for property:", property._id.toString());

    /* ---------------- CREATE LEAD ---------------- */
    const lead = await Lead.create({
      property: property._id,
      agent: property.agent?._id || null,
      owner: property.owner?._id || null,
      user: user._id,
      name: body.name,
      email: body.email,
      message: body.message,
      phone: body.phone,
    });

    /* ---------------- INCREMENT PROPERTY LEADS COUNT ---------------- */

    await Property.findByIdAndUpdate(property._id, {
      $inc: { leadsCount: 1 },
    });

    const updated = await Property.findById(property._id);
    console.log("Updated leadsCount:", updated.leadsCount);

    // 🔔 Notify agent if exists
    if (property.agent?.user?._id) {
      await Notification.create({
        user: property.agent.user._id,
        type: "lead-received",
        message: `New lead on "${property.title}"`,
        link: `/agents/${property.agent._id}/leads`,
      });
    }

    // 🔔 Always notify owner
    await Notification.create({
      user: property.owner,
      type: "lead-received",
      message: `New enquiry for your property "${property.title}"`,
      link: `/me/enquiries`,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("LEAD ERROR:", error);
    return NextResponse.json(
      { message: "Failed to submit lead" },
      { status: 500 },
    );
  }
}
