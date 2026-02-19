import Notification from "@/models/Notification";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/sendEmail";
import { propertyStatusEmailTemplate } from "@/lib/propertyStatusEmailTemplate.js";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    // console.log("ADMIN STATUS ROUTE HIT");

    await connectDB();

    const { approvalStatus, rejectionReason } = await req.json();

    if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const { id } = await context.params;

    const property = await Property.findById(id).populate("owner");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    if (property.approvalStatus === approvalStatus) {
      return NextResponse.json(
        { message: "Status already updated" },
        { status: 400 },
      );
    }

    property.approvalStatus = approvalStatus;

    if (approvalStatus === "rejected") {
      property.rejectionReason = rejectionReason || "Not specified";
    } else {
      property.rejectionReason = "";
    }
    await property.save();

    let title;
    let message;
    let type;
    let emailSubject;

    if (approvalStatus === "approved") {
      title = "Property Approved 🎉";
      message = `Your property "${property.title}" is now live.`;
      type = "property-approved";
      emailSubject = "Your Property is Live 🎉";
    } else if (approvalStatus === "rejected") {
      title = "Property Rejected ❌";
      message = `Your property "${property.title}" was rejected.`;
      type = "property-rejected";
      emailSubject = "Property Needs Update ❌";
    } else if (approvalStatus === "pending") {
      title = "Property Back Under Review ⏳";
      message = `Your property "${property.title}" is back under admin review.`;
      type = "property-pending";
      emailSubject = "Your Property Is Under Review Again ⏳";
    }

    /* 🔔 In-App Notification */
    await Notification.create({
      user: property.owner._id,
      title,
      message,
      type,
      link: "/my-properties",
    });

    try {
      await sendEmail({
        to: property.owner.email,
        subject: emailSubject,
        html: propertyStatusEmailTemplate({
          userName: property.owner.name,
          property,
          approvalStatus,
          rejectionReason: property.rejectionReason,
        }),
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN STATUS ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
