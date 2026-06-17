import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { activateSubscription } from "@/lib/activateSubscription";

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

export async function POST(req) {
    await connectDB();
    try {
        const { sessionId } = await req.json();
        const session =
            await stripe.checkout.sessions.retrieve(
                sessionId
            );

        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { success: false },
                {
                    status: 400
                }
            );
        }
        const userId =
            session.metadata.userId;
        const user =
            await User.findById(
                userId
            );
        if (!user) {
            return NextResponse.json(
                {
                    success: false
                },

                {
                    status: 404
                }
            );
        }

        const { agent } = await activateSubscription(
            user
        );
        return NextResponse.json({
            success: true,
            agentProfileId: agent._id
        });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                success: false,
                message: err.message
            },
            {
                status: 500
            }
        );
    }
}
