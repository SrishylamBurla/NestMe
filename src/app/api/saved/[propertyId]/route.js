import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SavedProperty from "@/models/SavedProperty";
import { getAuthUser } from "@/lib/getAuthUser";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function POST(req, context) {
  try {
    await connectDB();

    const { propertyId } = await context.params;

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID missing" },
        { status: 400 }
      );
    }

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const existing = await SavedProperty.findOne({
      user: user._id,
      property: propertyId,
    });

    // 🔁 If already saved → remove
    if (existing) {
      await existing.deleteOne();
      return NextResponse.json({ saved: false });
    }

    // ❤️ Otherwise create
    await SavedProperty.create({
      user: user._id,
      property: propertyId,
    });

    return NextResponse.json({ saved: true });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}




export async function DELETE(req, context) {
  try {
    await connectDB();

    const { propertyId } = await context.params;

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // delete only if belongs to user
    const deleted = await SavedProperty.findOneAndDelete({
      user: user._id,
      property: propertyId,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Saved property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from saved" });

  } catch (error) {
    console.error("DELETE SAVED ERROR:", error);
    return NextResponse.json(
      { message: "Failed to remove saved property" },
      { status: 500 }
    );
  }
}
