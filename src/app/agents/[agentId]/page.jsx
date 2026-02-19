"use client";

import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useGetAgentByIdQuery,
  useGetAgentPropertiesQuery,
} from "@/store/services/agentApi";

import AgentHero from "@/components/agent/AgentHero";
import AgentStats from "@/components/agent/AgentStats";
import AgentProperties from "@/components/agent/AgentProperties";
import AgentAbout from "@/components/agent/AgentAbout";

export default function AgentPublicProfilePage() {
  const { agentId } = useParams(); // ✅ FIXED

  const { data: agent, isLoading } = useGetAgentByIdQuery(agentId);

  const { data: properties } = useGetAgentPropertiesQuery(
    agent?._id ?? skipToken
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading agent profile…
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Agent not found
      </div>
    );
  }

  return (
    <div className="bg-[#F2F4F3] min-h-screen pb-24">
      <AgentHero agent={agent} />

      <div className="max-w-6xl mx-auto px-4 space-y-10 mt-6">
        <AgentStats agent={agent} />
        <AgentAbout agent={agent} />
        <AgentProperties properties={properties?.properties || []} />
      </div>
    </div>
  );
}
