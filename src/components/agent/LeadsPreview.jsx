"use client";

import { useRouter } from "next/navigation";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { useAuth } from "@/hooks/useAuth";


const LeadItem = ({ lead, agentId }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (!agentId) return;
        router.push(`/agents/${agentId}/leads`);
      }}
      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold">
        {lead.user?.name?.[0] || "U"}
      </div>

      <div className="flex-1">
        <p className="font-bold">{lead.user?.name || "Unknown"}</p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {lead.property?.title || "No property"}
        </p>
      </div>

      {!lead.isRead && (
        <span className="text-xs text-red-500 font-bold">NEW</span>
      )}
    </div>
  );
};

export default function LeadsPreview() {
  // ✅ FIXED
  const { user, isLoading: userLoading } = useAuth();
  const agentId = user?.agentProfileId;

  const { data: leadsData, isLoading } =
    useGetAgentLeadsQuery(agentId, {
      skip: !agentId,
    });

  const leads = leadsData?.leads?.slice(0, 3) || [];

  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-bold mb-3">New Leads</h3>

      {( isLoading) && (
        <p className="text-sm text-gray-500">Loading leads...</p>
      )}

      {!isLoading && leads.length === 0 && (
        <p className="text-sm text-gray-400">No leads yet</p>
      )}

      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadItem
            key={lead._id}
            lead={lead}
            agentId={agentId} // ✅ FIXED
          />
        ))}
      </div>
    </div>
  );
}