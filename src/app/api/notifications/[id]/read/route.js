import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("MARK READ ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
