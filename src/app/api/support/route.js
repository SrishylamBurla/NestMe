import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import Notification from "@/models/Notification";
import { getAuthUser } from "@/lib/getAuthUser";
import User from "@/models/User";



export async function POST(req) {
  try {

    await connectDB();

    const user =
      await getAuthUser();

    if (!user) {

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // BODY
    // =========================

    const body =
      await req.json();

    const {
      text,
      file,
      subject,
      ticketId,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (!text?.trim()) {

      return NextResponse.json(
        {
          error:
            "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    let ticket = null;

    // =========================
    // EXISTING TICKET
    // =========================

    if (ticketId) {

      ticket =
        await Support.findById(
          ticketId
        );
    }

    // =========================
    // CREATE NEW TICKET
    // =========================

    if (!ticket) {

      ticket =
        new Support({

          user:
            user._id,

          subject:
            subject ||
            "Support Chat",

          status:
            "open",

          messages: [
            {
              sender:
                "user",

              text,

              file:
                file || "",
            },
          ],
        });

    } else {

      // =========================
      // ADD MESSAGE
      // =========================

      ticket.messages.push({

        sender:
          "user",

        text,

        file:
          file || "",
      });

      ticket.status =
        "open";
    }

    // =========================
    // SAVE
    // =========================

    await ticket.save();

    // =========================
    // NOTIFY ADMINS
    // =========================

    const admins =
      await User.find({
        role: "admin",
      });

    if (admins.length > 0) {

      await Notification.insertMany(

        admins.map(
          (admin) => ({

            user:
              admin._id,

            title:
              "New Support Message",

            message:
              text,

            link:
              "/admin/support",
          })
        )
      );
    }

    // =========================
    // FETCH UPDATED TICKET
    // =========================

    const updatedTicket =
      await Support.findById(
        ticket._id
      ).lean();

    return NextResponse.json(
      updatedTicket
    );

  } catch (error) {

    console.error(
      "CREATE SUPPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong",
      },
      {
        status: 500,
      }
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