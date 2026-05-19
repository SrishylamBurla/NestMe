import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Support from "@/models/Support";

import { getAuthUser }
from "@/lib/getAuthUser";

import { sendMessageToUser }
from "@/lib/socket";


// ============================
// CREATE / SEND SUPPORT MESSAGE
// ============================

export async function POST(req) {

  try {

    await connectDB();

    // =========================
    // AUTH USER
    // =========================

    const user =
      await getAuthUser();

    if (!user) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
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
            "Message required",
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

      ticket = new Support({

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
      // PUSH NEW MESSAGE
      // =========================

      ticket.messages.push({

        sender:
          "user",

        text,

        file:
          file || "",
      });

      // =========================
      // REOPEN TICKET
      // =========================

      ticket.status =
        "open";
    }

    // =========================
    // SAVE
    // =========================

    await ticket.save();

    // =========================
    // FETCH UPDATED TICKET
    // =========================

    const updatedTicket =
      await Support.findById(
        ticket._id
      ).lean();

    // =========================
    // REALTIME SOCKET
    // =========================

    sendMessageToUser(
      user._id.toString(),
      updatedTicket
    );

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json(
      updatedTicket
    );

  } catch (error) {

    console.error(
      "SUPPORT API ERROR:",
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
// GET USER TICKETS
// ============================

export async function GET() {

  try {

    await connectDB();

    const user =
      await getAuthUser();

    if (!user) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const tickets =
      await Support.find({

        user:
          user._id,

      })
        .sort({
          updatedAt: -1,
        })
        .lean();

    return NextResponse.json(
      tickets
    );

  } catch (error) {

    console.error(
      "GET SUPPORT ERROR:",
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