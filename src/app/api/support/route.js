import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";


// ============================
// ✅ CREATE SUPPORT TICKET
// ============================
export async function POST(req) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const subject = formData.get("subject");
    const message = formData.get("message");
    const file = formData.get("file");

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 📁 Upload file (optional)
    let fileUrl = "";
    if (file) {
      fileUrl = await cloudinary(file);
    }

    // ✅ Create ticket
    const ticket = await Support.create({
      user: user._id,
      subject: subject || "No Subject",
      status: "open",
      messages: [
        {
          sender: "user",
          text: message,
          file: fileUrl,
        },
      ],
    });

    // 🔔 Notify all admins
    const admins = await User.find({ role: "admin" });

    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map((admin) => ({
          user: admin._id,
          title: "New Support Ticket",
          message: subject || "New message received",
          link: "/admin/support",
        }))
      );
    }

    return NextResponse.json(ticket);

  } catch (error) {
    console.error("CREATE SUPPORT ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


// ============================
// ✅ GET USER TICKETS
// ============================
export async function GET() {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tickets = await Support.find({ user: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(tickets);

  } catch (error) {
    console.error("GET SUPPORT ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}