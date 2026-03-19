import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const enquiries = await Enquiry.find({
    user: user._id
  })
    .populate("property", "title images city")
    .populate("agent", "name") // optional
    .sort({ createdAt: -1 });

  return Response.json({ enquiries });
}