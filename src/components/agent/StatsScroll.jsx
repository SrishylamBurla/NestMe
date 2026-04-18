"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";


const StatCard = ({ icon, label, value, sub, color }) => {
  return (
    <div className="min-w-[200px] relative rounded-2xl p-[1px] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl shadow-lg">
      <div className="bg-white/80 rounded-2xl p-4 h-full flex flex-col justify-between">

        {/* TOP */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${color}`}
          >
            <span className="material-symbols-outlined text-white text-lg">
              {icon}
            </span>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            {label}
          </span>
        </div>

        {/* VALUE */}
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {sub}
          </p>
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default function StatsScroll() {
  const  { user, userLoading } = useAuth()
  const agentId = user?.agentProfileId;

  const { data: properties } = useGetAgentPropertiesQuery(agentId, {
    skip: !agentId,
  });

  const { data: leads } = useGetAgentLeadsQuery(agentId, {
    skip: !agentId,
  });

  if (userLoading) return null;

  const props = properties?.properties || [];
  const leadList = leads?.leads || [];

  const activeListings = props.filter(
    (p) =>
      p.approvalStatus === "approved" &&
      p.listingStatus === "available"
  ).length;

  const pendingApproval = props.filter(
    (p) => p.approvalStatus === "pending"
  ).length;

  const closedDeals = props.filter(
    (p) =>
      p.listingStatus === "sold" ||
      p.listingStatus === "rented"
  ).length;

  const newLeadsToday = leadList.filter((l) => {
    const today = new Date().toDateString();
    return new Date(l.createdAt).toDateString() === today;
  }).length;

  return (
    <div className="px-4 pt-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-800">
          Overview
        </h3>

        <span className="text-xs text-gray-400">
          Updated now
        </span>
      </div>

      {/* SCROLL */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">

        <StatCard
          icon="real_estate_agent"
          label="Active Listings"
          value={activeListings}
          sub={`${pendingApproval} pending approval`}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />

        <StatCard
          icon="person_add"
          label="New Leads"
          value={leadList.length}
          sub={`+${newLeadsToday} today`}
          color="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          icon="verified"
          label="Closed Deals"
          value={closedDeals}
          sub="Sold / Rented"
          color="bg-gradient-to-br from-purple-500 to-pink-500"
        />
      </div>
    </div>
  );
}