import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SavedProperty from "@/models/SavedProperty";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const saved = await SavedProperty.find({ user: user._id })
  .populate("property")
  .sort({ createdAt: -1 });


    return NextResponse.json({ saved });

  } catch (error) {
    console.error("GET SAVED ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
