// import connectDB from "@/lib/db";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// import AgentProfile from "@/models/AgentProfile";
// import Enquiry from "@/models/Enquiry";

// export async function GET(req, context) {
//   await connectDB();

//   const { agentId } = await context.params;

//   // Validate ID
//   if (!mongoose.Types.ObjectId.isValid(agentId)) {
//     return NextResponse.json(
//       { message: "Invalid agent ID" },
//       { status: 400 }
//     );
//   }

//   // 1️⃣ Find agent profile
//   const agent = await AgentProfile.findById(agentId);

//   if (!agent) {
//     return NextResponse.json(
//       { message: "Agent not found" },
//       { status: 404 }
//     );
//   }

//   // 2️⃣ Get userId from agent profile
//   const userId = agent.user;

//   // 3️⃣ Find enquiries MADE by this agent (user)
//   const enquiries = await Enquiry.find({
//     enquirer: userId, // 🔥 IMPORTANT
//   })
//     .populate("property")
//     .populate({
//       path: "property",
//       populate: [
//         { path: "owner", select: "name" },
//         {
//           path: "agent",
//           populate: {
//             path: "user",
//             select: "name",
//           },
//         },
//       ],
//     })
//     .sort({ createdAt: -1 });

//   return NextResponse.json({ enquiries });
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import AgentProfile from "@/models/AgentProfile";
import mongoose from "mongoose";

export async function GET(req, context) {
  await connectDB();

  const { agentId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return NextResponse.json(
      { message: "Invalid agent ID" },
      { status: 400 }
    );
  }

  // 🔹 Find agent profile
  const agentProfile = await AgentProfile.findById(agentId);

  if (!agentProfile) {
    return NextResponse.json(
      { message: "Agent not found" },
      { status: 404 }
    );
  }

  // 🔥 KEY: agent enquiries are made by agent's USER ID
  const enquiries = await Lead.find({
    user: agentProfile.user,
  })
    .populate("property", "title images")
    .populate({
      path: "agent",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });

  return NextResponse.json({ enquiries });
}