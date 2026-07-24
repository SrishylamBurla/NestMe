import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser"

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

/* ==========================================
   CREATE TICKET
========================================== */
export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!["user", "agent"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only users and agents can create support tickets.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { subject, category, priority, message } = body;

    const ticket = await SupportTicket.create({
      ticketNumber: `NM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      user: user._id,
      createdByRole: user.role,
      subject,
      category,
      priority,
      lastMessage: message,
      lastMessageAt: new Date(),
      unreadAdmin: 1,
    });


    await SupportMessage.create({
      ticket: ticket._id,
      sender: user._id,
      senderRole: user.role,
      message,
    });


    return NextResponse.json({
      success: true,
      ticket,
    });

  } catch (err) {
    console.error(err);
    console.error(err.stack);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}

/* ==========================================
   GET MY TICKETS
========================================== */
export async function GET() {
  try {

    await connectDB();

    const user = await getAuthUser();

    const tickets = await SupportTicket.find({
      user: user._id,
    }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error("SUPPORT GET ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}