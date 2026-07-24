import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";

export async function GET() {
  try {
    await connectDB();

    const admin = await getAuthUser();

    // Optional: protect the route
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

    const tickets = await SupportTicket.find({})
      .populate("user", "name email phone profileImage")
      .populate("assignedTo", "name email")
      .select(
        "ticketNumber subject category priority status assignedTo user lastMessage lastMessageAt unreadAdmin updatedAt createdAt"
      )
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}