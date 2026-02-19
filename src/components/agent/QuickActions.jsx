"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";
import { useCreateAgentLeadMutation } from "@/store/services/LeadApi";

// const ActionBtn = ({ icon, label, primary, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex flex-col gap-2 p-4 rounded-xl items-start transition ${
//       primary
//         ? "bg-blue-600 text-white shadow-lg"
//         : "bg-white shadow-sm hover:shadow-md"
//     }`}
//   >
//     <span className="material-symbols-outlined text-2xl">{icon}</span>
//     <span className="text-sm font-bold">{label}</span>
//   </button>
// );

const ActionBtn = ({ icon, label, primary, onClick, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex flex-col gap-2 p-4 rounded-xl items-start transition 
      ${primary ? "bg-blue-600 text-white shadow-lg" : "bg-white shadow-sm"}
      ${
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "hover:shadow-md"
      }
    `}
  >
    <span className="material-symbols-outlined text-2xl">{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default function QuickActions() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [createLead] = useCreateAgentLeadMutation();

  const [form, setForm] = useState({
    propertyId: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetMeQuery();

  const agentId = user?.agentProfileId;

  const { data: properties } = useGetAgentPropertiesQuery(agentId, {
    skip: !agentId,
  });

  const { data: leads } = useGetAgentLeadsQuery(agentId, {
    skip: !agentId,
  });

  const props = properties?.properties || [];
  const pendingCount = props.filter(
    (p) => p.approvalStatus === "pending",
  ).length;

  /* ---------------- HANDLERS ---------------- */

  const handleAddListing = () => {
    if (!agentId) return;

    if (pendingCount >= 3) {
      alert("You already have 3 properties waiting for approval.");
      return;
    }

    router.push("/add-property");
  };

  const handleAddLead = () => {
    if (!agentId) return;
    setShowLeadModal(true);
    // router.push(`/agents/${agentId}/leads`);
  };

  const handleScheduleVisit = () => {
    if (!agentId) return;
    router.push(`/agents/${agentId}/appointments`);
  };

  const handleMapView = () => {
    router.push("/map");
  };

  /* ---------------- UI ---------------- */

  if (userLoading) return null; // prevent early render

  return (
    <div className="px-4 py-4">
      <h4 className="text-xs text-gray-500 font-bold mb-3">Quick Actions</h4>

      <div className="grid grid-cols-2 gap-3">
        <ActionBtn
          icon="add_home"
          label="Add Listing"
          onClick={handleAddListing}
        />

        <ActionBtn
          icon="person_add"
          label={`Leads (${leads?.leads?.length || 0})`}
          onClick={handleAddLead}
        />

        <ActionBtn
          icon="calendar_add_on"
          label="Schedule Visit"
          onClick={handleScheduleVisit}
          disabled
        />

        <ActionBtn icon="map" label="View Map" onClick={handleMapView} disabled />
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[95%] max-w-md space-y-4">
            <h3 className="font-bold text-lg">Create Lead</h3>

            <select
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
            >
              <option value="">Select Property</option>
              {props.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <input
              placeholder="Client Name"
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Client Email"
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Client Phone"
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <textarea
              placeholder="Notes"
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <div className="flex gap-3">
              <button
                className="flex-1 border rounded py-2"
                onClick={() => setShowLeadModal(false)}
              >
                Cancel
              </button>

              <button
                className="flex-1 bg-blue-600 text-white rounded py-2"
                onClick={async () => {
                  await createLead({ agentId, ...form }).unwrap();
                  setShowLeadModal(false);
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
