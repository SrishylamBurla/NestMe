import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/sendPushNotification";
import { sendEmail } from "@/lib/sendEmail";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const admin = await getAuthUser();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Admin only" }, { status: 403 });
    }

    const { approvalStatus, rejectionReason = "" } = await req.json();

    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const property = await Property.findById(params.id);

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    property.approvalStatus = approvalStatus;
    property.rejectionReason =
      approvalStatus === "rejected" ? rejectionReason : "";

    await property.save();


    const owner = await User.findById(property.owner);

    

    let title = "";
    let message = "";
    let type = "";
    let priority = "medium";

    switch (approvalStatus) {
      case "approved":
        title = "Property Approved 🎉";
        message = `${property.title} has been approved and is now live.`;
        type = "property-approved";
        break;

      case "rejected":
        title = "Property Rejected ❌";
        message = `${property.title} has been rejected.

Reason: ${rejectionReason}`;
        type = "property-rejected";
        priority = "high";
        break;

      case "pending":
        title = "Property Returned for Review 🔄";
        message = `${property.title} has been moved back to review by the admin.`;
        type = "property-pending";
        break;
    }
    await Notification.create({
      user: owner._id,
      title,
      message,
      type,
      entityId: property._id,
      priority,
      link: `/properties/${property._id}`,
    });

    // sendNotification(owner._id.toString(), notification);

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

    console.log("Owner:", owner.email);
console.log("FCM Tokens:", owner.fcmTokens);
console.log("Sending push...");

    if (owner.email) {
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
    }

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: 500,
      },
    );
  }
}

// import Notification from "@/models/Notification";
// import Property from "@/models/Property";
// import connectDB from "@/lib/db";
// import { sendEmail } from "@/lib/sendEmail";
// import { propertyStatusEmailTemplate } from "@/lib/propertyStatusEmailTemplate.js";
// import { NextResponse } from "next/server";

// export async function PUT(req, context) {
//   try {

//     await connectDB();

//     const { approvalStatus, rejectionReason } = await req.json();

//     if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
//       return NextResponse.json({ message: "Invalid status" }, { status: 400 });
//     }

//     const { id } = await context.params;

//     const property = await Property.findById(id).populate("owner");

//     if (!property) {
//       return NextResponse.json(
//         { message: "Property not found" },
//         { status: 404 },
//       );
//     }

//     if (property.approvalStatus === approvalStatus) {
//       return NextResponse.json(
//         { message: "Status already updated" },
//         { status: 400 },
//       );
//     }

//     property.approvalStatus = approvalStatus;

//     if (approvalStatus === "rejected") {
//       property.rejectionReason = rejectionReason || "Not specified";
//     } else {
//       property.rejectionReason = "";
//     }
//     await property.save();

//     let title;
//     let message;
//     let type;
//     let emailSubject;

//     if (approvalStatus === "approved") {
//       title = "Property Approved 🎉";
//       message = `Your property "${property.title}" is now live.`;
//       type = "property-approved";
//       emailSubject = "Your Property is Live 🎉";
//     } else if (approvalStatus === "rejected") {
//       title = "Property Rejected ❌";
//       message = `Your property "${property.title}" was rejected.`;
//       type = "property-rejected";
//       emailSubject = "Property Needs Update ❌";
//     } else if (approvalStatus === "pending") {
//       title = "Property Back Under Review ⏳";
//       message = `Your property "${property.title}" is back under admin review.`;
//       type = "property-pending";
//       emailSubject = "Your Property Is Under Review Again ⏳";
//     }

//     /* 🔔 In-App Notification */
//     await Notification.create({
//       user: property.owner._id,
//       title,
//       message,
//       type,
//       entityId: property._id,
//       link: "/my-properties",
//     });

//     try {
//       await sendEmail({
//         to: property.owner.email,
//         subject: emailSubject,
//         html: propertyStatusEmailTemplate({
//           userName: property.owner.name,
//           property,
//           approvalStatus,
//           rejectionReason: property.rejectionReason,
//         }),
//       });
//     } catch (emailError) {
//       console.error("Email failed:", emailError.message);
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("ADMIN STATUS ERROR:", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }
