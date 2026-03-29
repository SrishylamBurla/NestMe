import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";
import AgentProfile from "@/models/AgentProfile";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { plan } = await req.json();

  const planPrices = {
    basic: 999,
    pro: 1999,
    enterprise: 4999,
  };

  const durationDays = 30;

  /* ================= CREATE SUBSCRIPTION ================= */

  const subscription = await Subscription.create({
  user: user._id,
  plan,
  price: planPrices[plan],
  status: "active",
  startDate: new Date(),
  endDate: new Date(
    Date.now() + durationDays * 24 * 60 * 60 * 1000
  ),
});

  /* ================= CREATE AGENT PROFILE ================= */

  const agentProfile = await AgentProfile.findOneAndUpdate(
  { user: user._id },
  {
    $setOnInsert: {
      user: user._id,
      designation: user.destination || "Real Estate Agent",
      city: "",
    }
  },
  { new: true, upsert: true }
);

  /* ================= UPDATE EXISTING PROPERTIES ================= */

  await Property.updateMany(
    { owner: user._id, agent: null },
    { agent: agentProfile._id }
  );

  /* ================= UPDATE USER ================= */

  user.role = "agent";
  user.agentProfileId = agentProfile._id;
  await user.save();

  return NextResponse.json({
    message: "Subscription successful",
    subscription,
    agentProfileId: agentProfile._id,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      agentProfileId: user.agentProfileId,
    },
  });
}


export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const subscription = await Subscription.findOne({
    user: user._id,
  }).sort({ createdAt: -1 });

  if (!subscription) {
    return NextResponse.json({
      subscription: null,
      isActive: false,
      daysRemaining: 0,
    });
  }

  const now = new Date();
  const end = new Date(subscription.endDate);

  const daysRemaining = Math.max(
    0,
    Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  );

  return NextResponse.json({
    subscription,
    isActive: daysRemaining > 0,
    daysRemaining,
  });
}