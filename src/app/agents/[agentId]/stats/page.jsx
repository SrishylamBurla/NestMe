"use client";
import { useGetAgentStatsQuery } from "@/store/services/agentApi";
import { useParams } from "next/navigation";

export default function StatsPage() {
  const { id } = useParams();
  const { data } = useGetAgentStatsQuery(id);

  return (
    <div className="p-6 space-y-4">
      <Stat label="Properties" value={data?.totalProperties || 0} />
      <Stat label="Leads" value={data?.totalLeads || 0} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
