import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import { messaging } from "@/lib/firebaseAdmin";
import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";
import User from "@/models/User";

export async function POST(req, context) {
  try {
    await connectDB();

    const user = await getAuthUser();

    const { id } = context.params;

    const body = await req.json();

    const message = body?.message ?? "";
    const attachments = Array.isArray(body?.attachments)
      ? body.attachments
      : [];

    if (!message?.trim() && attachments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot be empty.",
        },
        {
          status: 400,
        },
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
        },
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
        },
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
        },
      );
    }

    const newMessage = await SupportMessage.create({
      ticket: ticket._id,
      sender: user._id,
      senderRole: user.role,
      message,
      attachments,
      deliveredAt: new Date(),
    });

    ticket.lastMessage = message;
    ticket.lastMessageAt = new Date();

    ticket.status = "waiting";

    ticket.unreadAdmin += 1;

    await ticket.save();

    await newMessage.populate("sender", "name avatar role");

    // Save message...

    const customer = await User.findById(ticket.user);

    if (customer?.fcmTokens?.length) {
      try {
        await messaging.send({
          token: customer.fcmTokens[0],
          notification: {
            title: "NestMe Support",
            body: "Agent replied to your ticket",
          },
          data: {
            ticketId: ticket._id.toString(),
            screen: "SupportChat",
          },
        });
      } catch (err) {
        console.error("FCM notification failed:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: newMessage,
      },
      {
        status: 201,
      },
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
      },
    );
  }
}
