import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";
import Notification from "@/models/Notification";
import { sendLeadEmail } from "@/lib/sendLeadEmail";
import { sendNotification } from "@/lib/socket";
import { sendPush } from "@/lib/sendPushNotification";

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { propertyId, message, phone } = await req.json();

  const property = await Property.findById(propertyId)
    .populate({
      path: "agent",
      populate: { path: "user", select: "email name pushTokens" },
    })
    .populate("owner", "email name pushTokens");

  if (!property)
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 },
    );

  /* ---------------- DETERMINE RECEIVER ---------------- */
  let receiverUserId;
  let receiverEmail;
  let receiverType;

  if (property.agent?.user) {
    receiverUserId = property.agent.user._id;
    receiverEmail = property.agent.user.email;
    receiverType = "agent";
  } else if (property.owner) {
    receiverUserId = property.owner._id;
    receiverEmail = property.owner.email;
    receiverType = "owner";
  } else {
    return NextResponse.json(
      { message: "No contact available for this property" },
      { status: 400 },
    );
  }

  /* ---------------- CREATE LEAD ---------------- */
  const lead = await Lead.create({
    property: propertyId,
    agent: property.agent?._id || null,
    owner: property.owner?._id || null, // 🔥 add this field in schema
    user: user._id,
    message,
    phone,
  });

  /* ---------------- INCREMENT PROPERTY LEADS COUNT ---------------- */
  await Property.findByIdAndUpdate(propertyId, {
    $inc: { leadsCount: 1 },
  });

  // Create notification
  const notification = await Notification.create({
    user: receiverUserId,
    title: "New Lead Received",
    message: `New enquiry for ${property.title}`,
    type: "lead-received",
    link:
      receiverType === "agent"
        ? `/agents/${property.agent._id}/leads`
        : `/my-leads`,
    entityId: lead._id,
  });

 

  // 🔥 REAL-TIME (SOCKET)
  sendNotification(receiverUserId.toString(), notification);
// 🔔 PUSH NOTIFICATION (OPTIMIZED)
let pushTokens = [];

if (receiverType === "agent") {
  pushTokens = property.agent?.user?.pushTokens || [];
} else {
  pushTokens = property.owner?.pushTokens || [];
}

if (pushTokens.length > 0) {
  await sendPush(
    pushTokens,
    "New Lead Received",
    `New enquiry for ${property.title}`
  );
}

  // Create notification
  // await Notification.create({
  //   user: receiverUserId,
  //   title: "New Lead Received",
  //   message: `New enquiry for ${property.title}`,
  //   type: "lead-received",
  //   link: `${receiverType === "agent" ? `/agents/${property.agent._id}/leads` : `/my-leads`}`,
  //   entityId: lead._id,
  // });
  /* ---------------- EMAIL ---------------- */
  const populatedLead = await Lead.findById(lead._id)
    .populate("user", "name email phone")
    .lean();

  await sendLeadEmail({
    agentEmail: receiverEmail,
    lead: populatedLead,
    property,
  });

  return NextResponse.json({ lead: populatedLead });
}
