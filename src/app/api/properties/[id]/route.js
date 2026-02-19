import { NextResponse } from "next/server";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Notification from "@/models/Notification";
import AgentProfile from "@/models/AgentProfile";
import mongoose from "mongoose";
import SavedProperty from "@/models/SavedProperty";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate("agent")
      .populate("owner", "name email");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    /* ---------------- CHECK IF SAVED ---------------- */
    let isSaved = false;

    const cookieStore = await cookies(); // ✅ FIXED
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const saved = await SavedProperty.findOne({
          user: decoded.id,
          property: property._id,
        });

        isSaved = !!saved;
      } catch (err) {
        // ignore invalid token
      }
    }

    const propertyData = property.toObject();
    propertyData.isSaved = isSaved;

    return NextResponse.json(propertyData);

  } catch (error) {
    console.error("PROPERTY FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


export async function PUT(req, context) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json();

  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const allowedStatus = ["pending", "approved", "rejected"];
  if (body.status && !allowedStatus.includes(body.status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  let property;

  // ADMIN
  if (user.role === "admin") {
    property = await Property.findById(id);
  }

  // AGENT
  else if (user.role === "agent") {
    property = await Property.findOne({
      _id: id,
      agent: user.agentProfileId,
    });

    body.approvalStatus = "pending"; // re-review
    body.rejectionReason = "";
  }

  // NORMAL USER
  else if (user.role === "user") {
    property = await Property.findOne({
      _id: id,
      owner: user._id,
    });

    body.approvalStatus = "pending"; // re-review
    body.rejectionReason = "";
  }

  if (!property)
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 },
    );

  Object.assign(property, body);
  await property.save();

  const ownerId = property.owner._id || property.owner;

  // 🔔 ADMIN STATUS CHANGE NOTIFICATION
  if (user.role === "admin" && body.status) {
    let type, title;

    if (body.status === "approved") {
      type = "property-approved";
      title = "Property Approved 🎉";
    } else if (body.status === "rejected") {
      type = "property-rejected";
      title = "Property Rejected ❌";
    }

    if (type) {
      await Notification.create({
        user: ownerId,
        type,
        title,
        message: `Your property "${property.title}" was ${body.status}.`,
        link: `/my-properties/${property._id}`,
      });
    }
  }

  

  return NextResponse.json({ success: true, property });
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    let property;

    if (user.role === "admin") {
      property = await Property.findById(id);
    } else if (user.role === "agent") {
      property = await Property.findOne({
        _id: id,
        agent: user.agentProfileId,
      });
    } else {
      property = await Property.findOne({ _id: id, owner: user._id });
    }

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    await property.deleteOne();

    return NextResponse.json({ message: "Property deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
