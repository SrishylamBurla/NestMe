"use client";

import { useRouter, usePathname } from "next/navigation";
import { useGetMeQuery } from "@/store/services/authApi";
import { useGetAgentLeadsQuery } from "@/store/services/agentApi";
import { skipToken } from "@reduxjs/toolkit/query";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading } = useGetMeQuery();
  const agentId = user?.agentProfileId;

  const { data: leads } = useGetAgentLeadsQuery(agentId ?? skipToken,
  );

  const unreadLeads = leads?.leads?.filter(l => l.status === "new").length || 0;

  // 🚫 Don't render until we know user
  if (isLoading || !agentId) return null;

  return (
    <div className="flex justify-between md:hidden fixed bottom-0 left-0 w-full bg-white border-t py-2 px-4 pb-6 z-50">

      <NavItem
        icon="dashboard"
        label="Home"
        active={pathname === `/agents/${agentId}/dashboard`}
        onClick={() => router.push(`/agents/${agentId}/dashboard`)}
      />

      <NavItem
        icon="apartment"
        label="Listings"
        active={pathname.includes(`/agents/${agentId}/properties`)}
        onClick={() => router.push(`/agents/${agentId}/properties`)}
      />

      {/* ➕ Add Property */}
      <button
        onClick={() => router.push("/add-property")}
        className="relative -top-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {/* 👥 Leads */}
      <NavItem
        icon="groups"
        label="Leads"
        active={pathname.includes(`/agents/${agentId}/leads`)}
        onClick={() => router.push(`/agents/${agentId}/leads`)}
        badge={unreadLeads > 0}
      />

      {/* 👤 Profile */}
      <NavItem
        icon="person"
        label="Profile"
        active={pathname.includes(`/me`)}
        onClick={() => router.push(`/me`)}
      />
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center text-xs transition ${
      active ? "text-blue-600 font-bold" : "text-gray-400"
    }`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    {badge && (
      <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
    )}
    {label}
  </button>
);
