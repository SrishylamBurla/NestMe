import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function POST(req, context) {
  try {
    await connectDB();

    const admin = await getAuthUser();

    if (!admin || admin.role !== "admin") {
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

    const { id } = await context.params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket.assignedTo) {
      ticket.assignedTo = admin._id;
    }

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

    const body = await req.json();

    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    const supportMessage = await SupportMessage.create({
      ticket: ticket._id,
      sender: admin._id,
      senderRole: "admin",
      message,
    });

    ticket.lastMessage = message;
    ticket.lastMessageAt = new Date();

    ticket.unreadUser += 1;
    ticket.status = "waiting";
    await ticket.save();

    return NextResponse.json({
      success: true,
      message: supportMessage,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}