import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const user = await getAuthUser();

    // Only admins can reply
    if (user.role !== "admin") {
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

    const { id } = params;

    const { message, attachments = [] } =
      await req.json();

    if (!message?.trim() && attachments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Reply cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    const ticket =
      await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (ticket.status === "closed") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket is already closed.",
        },
        {
          status: 400,
        }
      );
    }

    const reply =
      await SupportMessage.create({
        ticket: ticket._id,
        sender: user._id,
        senderRole: "admin",
        message,
        attachments,
        deliveredAt: new Date(),
      });

    ticket.lastMessage = message;
    ticket.lastMessageAt = new Date();

    ticket.status = "waiting-user";

    ticket.unreadUser += 1;

    if (!ticket.assignedTo) {
      ticket.assignedTo = user._id;
    }

    await ticket.save();

    await reply.populate(
      "sender",
      "name profileImage role"
    );

    /*
      Socket.IO (Next Phase)

      io.to(`support-${ticket._id}`).emit(
          "support:new-message",
          reply
      );
    */

    return NextResponse.json(
      {
        success: true,
        message: reply,
      },
      {
        status: 201,
      }
    );
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