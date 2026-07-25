import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";

import SupportTicket from "@/models/SupportTicket";

export async function PATCH(req, context) {
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

        const { id } = await context.params;

        const ticket = await SupportTicket.findById(id);

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

        if (
            ticket.assignedTo &&
            ticket.assignedTo.toString() !== admin._id.toString()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This ticket is already assigned to another admin.",
                },
                {
                    status: 409,
                }
            );
        }

        ticket.assignedTo = admin._id;

        if (ticket.status === "open") {
            ticket.status = "waiting";
        }

        await ticket.save();

        return NextResponse.json({
            success: true,
            message: "Ticket assigned successfully.",
            ticket,
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