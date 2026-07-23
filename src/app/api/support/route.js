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
    console.log("STEP 1");
    await connectDB();

    console.log("STEP 2");
    const user = await getAuthUser();

    console.log("STEP 3", user);

    const body = await req.json();

    console.log("STEP 4", body);

    const { subject, category, priority, message } = body;

    console.log("STEP 5");

    const ticket = await SupportTicket.create({
      ticketNumber: `NM-${Date.now().toString().slice(-6)}`,
      user: user._id,
      subject,
      category,
      priority,
      lastMessage: message,
      lastMessageAt: new Date(),
      unreadAdmin: 1,
    });

    console.log("STEP 6");

    await SupportMessage.create({
      ticket: ticket._id,
      sender: user._id,
      senderRole: "user",
      message,
    });

    console.log("STEP 7");

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

    const tickets =
      await SupportTicket.find({
        user: user._id,
        isArchived: false,
      }).sort({
        updatedAt: -1,
      });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}