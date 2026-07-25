import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";

const ALLOWED_STATUS = [
  "open",
  "waiting",
  "resolved",
  "closed",
];

export async function PATCH(req, context) {
  try {
    await connectDB();

    const admin = await getAuthUser();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();

    const { status } = body;

    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 }
      );
    }

    ticket.status = status;

    await ticket.save();

    return NextResponse.json({
      success: true,
      ticket,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}