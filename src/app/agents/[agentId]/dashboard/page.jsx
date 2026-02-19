"use client";

import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import ProfileStats from "@/components/profile/ProfileStats";
import {
  useGetAgentPropertiesQuery,
  useGetAgentLeadsQuery,
} from "@/store/services/agentApi";

import { useGetMeQuery } from "@/store/services/authApi";

import DashboardHeader from "@/components/agent/DashboardHeader";
import StatsScroll from "@/components/agent/StatsScroll";
import QuickActions from "@/components/agent/QuickActions";
import LeadsPreview from "@/components/agent/LeadsPreview";
import PropertiesPreview from "@/components/agent/PropertiesPreview";
import BottomNav from "@/components/agent/BottomNav";
import Appointments from "@/components/agent/Appointments";

export default function AgentDashboardPage() {
  const router = useRouter();
  const params = useParams();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();

  const agentId =
    params?.agentId || userData?.agentProfileId;

  // 🚦 Prevent invalid agentId requests
  const { data: propertiesData } =
    useGetAgentPropertiesQuery(agentId ?? skipToken);

  const { data: leadsData } =
    useGetAgentLeadsQuery(agentId ?? skipToken);

  if (userLoading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!agentId) {
    return (
      <div className="p-6">
        <p>Invalid Agent</p>
      </div>
    );
  }

  const properties = propertiesData?.properties || [];
  const leads = leadsData?.leads || [];

  const activeListings = properties.filter(
    (p) =>
      p.approvalStatus === "approved" &&
      p.listingStatus === "available"
  ).length;

  const pendingListings = properties.filter(
    (p) => p.approvalStatus === "pending"
  ).length;

  const newLeads = leads.filter(
    (l) => l.status === "new"
  ).length;

  return (
    <div className="bg-[#f6f7f8] min-h-screen pb-28 font-sans">
      <DashboardHeader user={userData} />

      {/* STATS */}
      <StatsScroll
        activeListings={activeListings}
        pendingListings={pendingListings}
        newLeads={newLeads}
      />
      <ProfileStats />
      {/* ACTIONS */}
      <QuickActions agentId={agentId} />

      {/* <Appointments agentId={agentId} /> */}

      {/* PREVIEWS */}
      <LeadsPreview agentId={agentId} />

      <PropertiesPreview agentId={agentId} />

      <BottomNav />
    </div>
  );
}
