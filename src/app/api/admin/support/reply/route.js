import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import { sendMessageToUser } from "@/lib/socket";

export async function POST(req) {
  await connectDB();

  const { ticketId, message } = await req.json();

  const ticket = await Support.findById(ticketId);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // ✅ save admin message
  const newMsg = {
    sender: "admin",
    text: message,
  };

  ticket.messages.push(newMsg);
  await ticket.save();

  // ⚡ send to user (real-time)
  sendMessageToUser(ticket.user.toString(), newMsg);

  return NextResponse.json({ success: true });
}