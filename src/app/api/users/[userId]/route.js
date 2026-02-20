import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req, context) {
  await connectDB();

  const { userId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ message: "Invalid user ID" }, { status: 400 });
  }

  const user = await User.findById(userId)
    .select("name email") // safe fields only
    .lean();

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  return Response.json(user);
}