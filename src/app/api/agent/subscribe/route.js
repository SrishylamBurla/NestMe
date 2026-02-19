import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";
import AgentProfile from "@/models/AgentProfile";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req) {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  // Plan prices
  const planPrices = {
    basic: 999,
    pro: 1999,
    enterprise: 4999,
  };

  const durationDays = 30;

  const subscription = await Subscription.create({
    user: user._id,
    plan,
    price: planPrices[plan],
    endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
  });

  const agentProfile = await AgentProfile.create({
    user: user._id,
    designation: "Property Agent",
    city: "",
    experienceYears: 0,
    phone: "",
    bio: "",
    specializations: [],
    dealsClosed: 0,
    rating: 0,
    totalListings: 0,
    verified: false,
  });

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
