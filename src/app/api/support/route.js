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

    
    const body = await req.json();

    const {
      subject,
      category,
      priority,
      message,
    } = body;



    if (!subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject and message are required.",
        },
        {
          status: 400,
        }
      );
    }

    const ticket =
      await SupportTicket.create({
        user: user._id,
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
      senderRole: "user",
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket created successfully.",
        ticket,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
  console.error("========== SUPPORT ERROR ==========");
  console.error(err);
  console.error(err.stack);

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