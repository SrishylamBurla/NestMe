import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import Lead from "@/models/Lead";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { agentId } = await params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Total properties
    const propertiesCount = await Property.countDocuments({
      agent: agentId,
    });

    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfThisMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const leadsThisMonth = await Lead.countDocuments({
      agent: agentId,
      createdAt: { $gte: startOfThisMonth },
    });

    const leadsLastMonth = await Lead.countDocuments({
      agent: agentId,
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfThisMonth,
      },
    });

    // Total leads
    const leadsCount = await Lead.countDocuments({
      agent: agentId,
    });

    // Total views aggregation
    const viewsAgg = await Property.aggregate([
      { $match: { agent: new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewsCount" },
        },
      },
    ]);

    const viewsCount = viewsAgg[0]?.totalViews || 0;

    const topProperty = await Property.findOne({
      agent: agentId,
    })
      .sort({ views: -1 })
      .select("title priceValue viewsCount images")
      .lean();

    return NextResponse.json({
      propertiesCount,
      leadsCount,
      viewsCount,
      growth: {
        leadsThisMonth,
        leadsLastMonth,
      },
      topProperty,
    });
  } catch (error) {
    console.error("AGENT STATS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
