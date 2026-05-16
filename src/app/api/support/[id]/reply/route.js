import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import { sendMessageToUser } from "@/lib/socket";

export async function POST(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const ticket = await Support.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    ticket.messages.push({
      sender: "admin",
      text: message,
    });

    ticket.status = "open";

    await ticket.save();

    // ✅ plain JSON object
    const updatedTicket =
      await Support.findById(id).lean();

    // ✅ realtime emit
    sendMessageToUser(
      ticket.user.toString(),
      updatedTicket
    );

    return NextResponse.json(updatedTicket);

  } catch (error) {
    console.error("Reply API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}