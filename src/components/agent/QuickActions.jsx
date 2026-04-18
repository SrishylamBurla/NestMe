"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { useCreateAgentLeadMutation } from "@/store/services/LeadApi";
import { useAuth } from "@/hooks/useAuth";

/* ================= PREMIUM BUTTON ================= */
const ActionBtn = ({ icon, label, primary, onClick, disabled, sub }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative rounded-2xl p-[1px] transition group
        ${
          primary
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : "bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl"
        }
      `}
    >
      <div
        className={`rounded-2xl p-4 h-full flex flex-col justify-between
        ${primary ? "bg-transparent text-white" : "bg-white/80"}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "group-hover:shadow-lg"
        }
      `}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={`material-symbols-outlined text-2xl ${
              primary ? "text-white" : "text-indigo-600"
            }`}
          >
            {icon}
          </span>

          {!primary && sub && (
            <span className="text-xs text-gray-400">{sub}</span>
          )}
        </div>

        <p className="text-sm font-semibold">{label}</p>
      </div>
    </button>
  );
};

export default function QuickActions() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [createLead, { isLoading }] = useCreateAgentLeadMutation();

  const [form, setForm] = useState({
    propertyId: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const router = useRouter();
  const { user } = useAuth()

  const agentId = user?.agentProfileId;

  const { data: properties } = useGetAgentPropertiesQuery(agentId, {
    skip: !agentId,
  });

  const { data: leads } = useGetAgentLeadsQuery(agentId, {
    skip: !agentId,
  });

  const props = properties?.properties || [];
  const pendingCount = props.filter(
    (p) => p.approvalStatus === "pending"
  ).length;

  /* ================= HANDLERS ================= */

  const handleAddListing = () => {
    if (!agentId) return;

    if (pendingCount >= 3) {
      alert("Max 3 pending listings allowed.");
      return;
    }

    router.push("/add-property");
  };

  const handleAddLead = () => {
    if (!agentId) return;
    setShowLeadModal(true);
  };

  const handleScheduleVisit = () => {
    if (!agentId) return;
    router.push(`/agents/${agentId}/appointments`);
  };

  const handleMapView = () => {
    router.push("/map");
  };

  if (!user) return null;

  return (
    <div className="px-4 py-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800">
          Quick Actions
        </h4>
        <span className="text-xs text-gray-400">
          Manage faster ⚡
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        <ActionBtn
          icon="add_home"
          label="Add Listing"
          sub={`${pendingCount} pending`}
          onClick={handleAddListing}
          primary
        />

        <ActionBtn
          icon="person_add"
          label="Add Lead"
          sub={`${leads?.leads?.length || 0} total`}
          onClick={handleAddLead}
        />

        <ActionBtn
          icon="calendar_add_on"
          label="Schedule Visit"
          onClick={handleScheduleVisit}
          disabled
        />

        <ActionBtn
          icon="map"
          label="Map View"
          onClick={handleMapView}
          disabled
        />
      </div>

      {/* ================= PREMIUM MODAL ================= */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 animate-slideUp">

            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Create Lead</h3>
              <button onClick={() => setShowLeadModal(false)}>✕</button>
            </div>

            <select
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, propertyId: e.target.value })
              }
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
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <textarea
              placeholder="Notes"
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md"
              onClick={async () => {
                await createLead({ agentId, ...form }).unwrap();
                setShowLeadModal(false);
              }}
            >
              {isLoading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}