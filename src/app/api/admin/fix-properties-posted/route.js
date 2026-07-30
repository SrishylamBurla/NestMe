import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Property from "@/models/Property";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find();

    for (const user of users) {
      const count = await Property.countDocuments({
        owner: user._id,
      });

      await User.findByIdAndUpdate(user._id, {
        propertiesPosted: count,
      });
    }

    return NextResponse.json({
      success: true,
      message: "propertiesPosted updated successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}