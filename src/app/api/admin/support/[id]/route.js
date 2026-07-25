import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function GET(req, context) {
  const { id } = await context.params;

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

    const ticket = await SupportTicket.findById(id)
      .populate("user", "name email phone role avatar")
      .populate("assignedTo", "name email");

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

    const messages = await SupportMessage.find({
      ticket: params.id,
    })
      .populate("sender", "name role avatar")
      .sort({
        createdAt: 1,
      });

    return NextResponse.json({
      success: true,
      ticket,
      messages,
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