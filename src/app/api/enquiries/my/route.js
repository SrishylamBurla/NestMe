import { getAuthUser } from "@/lib/getAuthUser";
import connectDB from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  await connectDB();
  const user = await getAuthUser();

  const enquiries = await Enquiry.find({ toOwner: user._id })
    .populate("property fromUser");

  return NextResponse.json({ enquiries });
}
