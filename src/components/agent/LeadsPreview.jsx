"use client";

import { useRouter } from "next/navigation";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";

const LeadItem = ({ lead, agentId }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/agents/${agentId}/leads`)}
      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold">
        {lead.user?.name?.[0]}
      </div>

      <div className="flex-1">
        <p className="font-bold">{lead.user?.name}</p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {lead.property?.title}
        </p>
      </div>

      {!lead.isRead && (
        <span className="text-xs text-red-500 font-bold">NEW</span>
      )}
    </div>
  );
};

export default function LeadsPreview() {
  const { data: user } = useGetMeQuery();

//   console.log("LOGGED USER:", user);
// console.log("AGENT PROFILE ID:", user?.agentProfileId);

  const agentId = user?.agentProfileId;

  const { data, isLoading } = useGetAgentLeadsQuery(agentId, {
    skip: !agentId,
  });

  const leads = data?.leads?.slice(0, 3) || [];

  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-bold mb-3">New Leads</h3>

      {isLoading && <p className="text-sm text-gray-500">Loading leads...</p>}

      {!isLoading && leads.length === 0 && (
        <p className="text-sm text-gray-400">No leads yet</p>
      )}

      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadItem key={lead._id} lead={lead} agentId={agentId} />
        ))}
      </div>
    </div>
  );
}
