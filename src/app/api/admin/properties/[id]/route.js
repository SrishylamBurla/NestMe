import connectDB from "@/lib/db";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
// import { sendNotification } from "@/lib/socket";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/sendPushNotification";
import { sendEmail } from "@/lib/sendEmail";

export async function PATCH(req, { params }) {
  await connectDB();

  const user = await getAuthUser();

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  const { status } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const property = await Property.findById(params.id);

  if (!property) {
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 },
    );
  }

  property.status = status;
  await property.save();
  const owner = await User.findById(property.owner);

  if (!owner) {
    return NextResponse.json(
      { message: "Property owner not found" },
      { status: 404 },
    );
  }

  const title =
    status === "approved" ? "Property Approved 🎉" : "Property Rejected ❌";

  const message =
    status === "approved"
      ? `${property.title} has been approved and is now live.`
      : `${property.title} has been rejected. Please review and update your listing.`;

  const type =
    status === "approved" ? "property-approved" : "property-rejected";

  const priority = status === "approved" ? "medium" : "high";

  await Notification.create({
    user: owner._id,
    title,
    message,
    type,
    entityId: property._id,
    priority,
    link: `/properties/${property._id}`,
  });

  // Send Push Notification
  if (owner.fcmTokens?.length) {
    await sendPushNotification(owner.fcmTokens, {
      title,
      body: message,
      data: {
        type,
        screen: "PropertyDetails",
        propertyId: property._id.toString(),
      },
    });
  }

  // Send Email
  if (owner.email) {
    try {
      await sendEmail({
        to: owner.email,
        subject: title,
        html: `
        <h2>Hello ${owner.name},</h2>

        <p>${message}</p>

        <p>
          <a href="https://nestme.in/dashboard/properties">
            View Property
          </a>
        </p>

        <br/>

        <p>Regards,</p>
        <p>NestMe Team</p>
      `,
      });
    } catch (emailError) {
      console.error("Email Error:", emailError);
    }
  }
}
