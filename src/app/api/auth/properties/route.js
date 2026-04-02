import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";
import AgentProfile from "@/models/AgentProfile";

export async function GET() {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const properties = await Property.find({
      owner: user._id,
    })
      .populate({
        path: "agent",
        select: "user", // only what you need
      })
      .sort({ createdAt: -1 })
      .lean(); // 🚀 performance boost

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    console.error("Get My Properties Error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
