import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const user = await getAuthUser();

    const { id } = params;

    const { message, attachments = [] } = await req.json();

    if (!message?.trim() && attachments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    const ticket = await SupportTicket.findById(id);

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

    if (ticket.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 403,
        }
      );
    }

    if (ticket.status === "closed") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket is closed.",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage = await SupportMessage.create({
      ticket: ticket._id,
      sender: user._id,
      senderRole: "user",
      message,
      attachments,
      deliveredAt: new Date(),
    });

    ticket.lastMessage = message;
    ticket.lastMessageAt = new Date();

    ticket.status = "waiting-support";

    ticket.unreadAdmin += 1;

    await ticket.save();

    await newMessage.populate(
      "sender",
      "name profileImage role"
    );

    /*
      Socket Event (Later)

      io.to(`support-${ticket._id}`).emit(
        "support:new-message",
        newMessage
      );
    */

    return NextResponse.json(
      {
        success: true,
        message: newMessage,
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