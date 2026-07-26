// import connectDB from "@/lib/db";
// import Property from "@/models/Property";
// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/getAuthUser";


// export async function PATCH(req, { params }) {
//   await connectDB();
//   const user = await getAuthUser();

//   if (user.role !== "admin")
//     return NextResponse.json({ message: "Admin only" }, { status: 403 });

//   const { status } = await req.json(); // approved or rejected
//   const property = await Property.findById(params.id);

//   property.status = status;
//   await property.save();

//   return NextResponse.json({ property });
// }



import connectDB from "@/lib/db";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { sendNotification } from "@/lib/socket";

export async function PATCH(req, { params }) {
  await connectDB();

  const user = await getAuthUser();

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Admin only" },
      { status: 403 }
    );
  }

  const { status } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status" },
      { status: 400 }
    );
  }

  const property = await Property.findById(params.id);

  if (!property) {
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 }
    );
  }

  property.status = status;
  await property.save();

  const notification = await Notification.create({
    user: property.owner, // Property owner
    title:
      status === "approved"
        ? "Property Approved 🎉"
        : "Property Rejected ❌",
    message:
      status === "approved"
        ? `${property.title} has been approved and is now live.`
        : `${property.title} has been rejected. Please review and update your listing.`,
    type:
      status === "approved"
        ? "property-approved"
        : "property-rejected",
    entityId: property._id,
    priority: status === "approved" ? "medium" : "high",
    link: `/properties/${property._id}`,
  });

  // Real-time notification
  sendNotification(property.owner.toString(), notification);

  return NextResponse.json({
    message: `Property ${status} successfully.`,
    property,
  });
}