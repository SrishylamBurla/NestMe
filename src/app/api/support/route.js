import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

/* ==========================================
   CREATE TICKET
========================================== */
export async function POST(req) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

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

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject and message are required.",
        },
        { status: 400 }
      );
    }

    const ticket = await SupportTicket.create({
      ticketNumber: `NM-${Date.now().toString().slice(-6)}-${Math.floor(
        Math.random() * 900 + 100
      )}`,
      user: user._id,
      createdByRole: user.role,
      subject: subject.trim(),
      category,
      priority,
      lastMessage: message.trim(),
      lastMessageAt: new Date(),
      unreadAdmin: 1,
      unreadUser: 0,
    });

    await SupportMessage.create({
      ticket: ticket._id,
      sender: user._id,
      senderRole: user.role, // "user" or "agent"
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (err) {
    console.error("CREATE SUPPORT TICKET ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (!["user", "agent"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const tickets = await SupportTicket.find({
      user: user._id,
    })
      .sort({
        updatedAt: -1,
      })
      .populate("assignedTo", "name");

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