import connectDB from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";


export async function GET(req, context) {
    await connectDB();
    const { id } = await context.params;
    const reviews = await Review.find({
        property: id
    }).populate("user", "name")
        .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
}


export async function POST(req, context) {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await context.params;
    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    const property =
        await Property.findById(id);

    if (!property) {
        return NextResponse.json(
            { message: "Property not found" },
            { status: 404 }
        )
    }

    if (property.owner?.toString() === user._id.toString()) {
        return NextResponse.json(
            {
                message:
                    "You cannot review your own property"
            },
            { status: 400 }
        )
    }
    const { rating, comment } = await req.json();

    const existing =
        await Review.findOne({
            property: id,
            user: user._id

        });

    if (existing) {
        return NextResponse.json(
            { message: "Already reviewed" },
            { status: 400 })
    }
    const review =
        await Review.create({
            property: id,
            user: user._id,
            rating,
            comment
        });
    return NextResponse.json(
        review
    );
}