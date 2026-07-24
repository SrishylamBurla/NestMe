import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = await getAuthUser();

    const { id } = params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      ticket.user.toString() === user._id.toString();

    const isAdmin =
      user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 }
      );
    }

    ticket.status = "closed";

    await ticket.save();

    return NextResponse.json({
      success: true,
      message: "Ticket closed successfully.",
      ticket,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}