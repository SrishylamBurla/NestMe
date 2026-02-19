"use client";

import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";

const StatCard = ({ icon, label, value, sub }) => (
  <div className="min-w-[160px] bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      <span className="material-symbols-outlined text-blue-500 text-lg">
        {icon}
      </span>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-green-500 text-xs">{sub}</p>
  </div>
);

export default function StatsScroll() {
  const { data: user, isLoading: userLoading } = useGetMeQuery();

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
    return (
      new Date(l.createdAt).toDateString() === today
    );
  }).length;

  return (
    <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
      <StatCard
        icon="real_estate_agent"
        label="Active Listings"
        value={activeListings}
        sub={`${pendingApproval} pending approval`}
      />

      <StatCard
        icon="person_add"
        label="New Leads"
        value={leadList.length}
        sub={`+${newLeadsToday} today`}
      />

      <StatCard
        icon="verified"
        label="Closed Deals"
        value={closedDeals}
        sub="Properties sold/rented"
      />
    </div>
  );
}
