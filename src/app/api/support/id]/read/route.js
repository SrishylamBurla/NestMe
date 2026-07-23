import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = await getAuthUser();

    const { id } = params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      ticket.user.toString() === user._id.toString();

    const isAdmin =
      user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 }
      );
    }

    if (isOwner) {
      await SupportMessage.updateMany(
        {
          ticket: ticket._id,
          senderRole: "admin",
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        }
      );

      ticket.unreadUser = 0;
    }

    if (isAdmin) {
      await SupportMessage.updateMany(
        {
          ticket: ticket._id,
          senderRole: "user",
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        }
      );

      ticket.unreadAdmin = 0;
    }

    await ticket.save();

    return NextResponse.json({
      success: true,
      message: "Messages marked as read.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}