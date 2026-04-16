import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import Notification from "@/models/Notification";

export async function POST(req, context) {
  try {
    await connectDB();


    const id = await context.params
    const { message } = await req.json();

    // ✅ Validate input
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // ✅ Find ticket
    const ticket = await Support.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // ✅ Push admin reply
    ticket.messages.push({
      sender: "admin",
      text: message,
    });

    // ✅ Optional: update status
    ticket.status = "open";

    await ticket.save();

    // 🔔 Notify user (fix field name)
    await Notification.create({
      user: ticket.userId, // ⚠️ IMPORTANT (not ticket.user)
      title: "Support Reply",
      message,
      link: "/support",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Reply API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}