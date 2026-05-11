import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import { sendMessageToUser } from "@/lib/socket";

export async function POST(req) {
  await connectDB();

  const { ticketId, message } =
    await req.json();

  const ticket =
    await Support.findById(ticketId);

  if (!ticket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  // ✅ save admin message
  ticket.messages.push({
    sender: "admin",
    text: message,
  });

  await ticket.save();

  // ✅ full updated ticket
  const updatedTicket =
    await Support.findById(ticketId)
      .lean();

  // ⚡ realtime emit
  sendMessageToUser(
    ticket.user.toString(),
    updatedTicket
  );

  return NextResponse.json(
    updatedTicket
  );
}