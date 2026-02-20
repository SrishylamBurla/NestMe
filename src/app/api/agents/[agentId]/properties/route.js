// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import { getAuthUser } from "@/lib/getAuthUser";
// import Property from "@/models/Property";

// export async function GET() {
//   await connectDB();

//   const user = await getAuthUser();
//   if (!user || user.role !== "agent")
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//   const properties = await Property.find({ agent: user.agentProfileId, approvalStatus: "approved" })
//     .sort({ createdAt: -1 });

//   return NextResponse.json({ properties });
// }

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Property from "@/models/Property";

export async function GET(req, context) {
  await connectDB();

  const { agentId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return Response.json({ message: "Invalid Agent ID" }, { status: 400 });
  }

  // ✅ PUBLIC FETCH
  const properties = await Property.find({
    agent: agentId,
    approvalStatus: "approved", // only show approved publicly
  })
    .sort({ createdAt: -1 });

  return Response.json({ properties });
}