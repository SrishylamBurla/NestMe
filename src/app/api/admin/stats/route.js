// import User from "@/models/User";
// import Property from "@/models/Property";
// import Lead from "@/models/Lead";
// import Subscription from "@/models/Subscription";
// import connectDB from "@/lib/db";
// import { NextResponse } from "next/server";


// export async function GET() {
//   await connectDB();

//   const revenueData = await Subscription.aggregate([
//     { $group: { _id: null, total: { $sum: "$price" } } }
//   ]);

//   return NextResponse.json({
//     users: await User.countDocuments(),
//     agents: await User.countDocuments({ role: "agent" }),
//     properties: await Property.countDocuments(),
//     leads: await Lead.countDocuments(),
//     revenue: revenueData[0]?.total || 0
//   });
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

import Subscription from "@/models/Subscription"

import User from "@/models/User";
import Property from "@/models/Property";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    await connectDB();

    /* ================= BASIC COUNTS ================= */

    const usersCount = await User.countDocuments({ role: "user" });
    const agentsCount = await User.countDocuments({ role: "agent" });
    const propertiesCount = await Property.countDocuments();
    const leadsCount = await Lead.countDocuments();


    const revenueData = await Subscription.aggregate([
    { $group: { _id: null, total: { $sum: "$price" } } }
  ]);

    /* ================= TOTAL VIEWS ================= */

    const viewsAgg = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const viewsCount = viewsAgg[0]?.totalViews || 0;

    /* ================= MONTHLY GROWTH ================= */

    const now = new Date();

    const firstDayThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const lastDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    );

    const leadsThisMonth = await Lead.countDocuments({
      createdAt: { $gte: firstDayThisMonth },
    });

    const leadsLastMonth = await Lead.countDocuments({
      createdAt: {
        $gte: firstDayLastMonth,
        $lte: lastDayLastMonth,
      },
    });

    /* ================= TOP AGENT ================= */

    const topAgentAgg = await Lead.aggregate([
      {
        $group: {
          _id: "$agent",
          leadsCount: { $sum: 1 },
        },
      },
      { $sort: { leadsCount: -1 } },
      { $limit: 1 },
    ]);

    let topAgent = null;

    if (topAgentAgg.length > 0) {
      topAgent = await User.findById(topAgentAgg[0]._id)
        .select("name email");
    }

    return NextResponse.json({
      usersCount,
      agentsCount,
      propertiesCount,
      leadsCount,
      viewsCount,
      growth: {
        leadsThisMonth,
        leadsLastMonth,
      },
      topAgent,

      users: await User.countDocuments(),
    agents: await User.countDocuments({ role: "agent" }),
    properties: await Property.countDocuments(),
    leads: await Lead.countDocuments(),
    revenue: revenueData[0]?.total || 0
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
