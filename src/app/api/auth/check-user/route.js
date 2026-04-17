import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  return Response.json({
    exists: !!user,
  });
}