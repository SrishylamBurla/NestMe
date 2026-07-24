import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const user = await getAuthUser();
if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}
    const { id } = params;

    const ticket = await SupportTicket.findById(id)
      .populate("user", "name email profileImage")
      .populate("assignedTo", "name");

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      ticket.user._id.toString() === user._id.toString();

    const isAdmin =
      user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    const messages = await SupportMessage.find({
      ticket: ticket._id,
    })
      .populate(
        "sender",
        "name profileImage role"
      )
      .sort({
        createdAt: 1,
      });

    // Mark admin messages as read when user opens ticket
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
      await ticket.save();
    }

    // Mark user messages as read when admin opens ticket
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
      await ticket.save();
    }

    return NextResponse.json({
      success: true,
      ticket,
      messages,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}