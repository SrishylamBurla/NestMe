"use client";

import { useMemo, useState } from "react";
import { useGetAgentsQuery } from "@/store/services/adminApi";

import {
  Search,
  ShieldCheck,
  ShieldX,
  Star,
  Building2,
  BadgeCheck,
} from "lucide-react";

export default function AdminAgentsPage() {
  const { data, isLoading, isError } = useGetAgentsQuery();

  const [search, setSearch] = useState("");

  const agents = useMemo(
  () => data?.agents || [],
  [data]
);

  // ================= FILTER =================
  const filteredAgents = useMemo(() => {
    return agents.filter((a) =>
      a.user?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [agents, search]);

  // ================= STATS =================
  const validAgents = agents.filter(
  (a) => a && a.user
);

const stats = {
  totalAgents: validAgents.length,

  verifiedAgents: validAgents.filter(
    (a) => a.verified
  ).length,

  totalListings: validAgents.reduce(
    (acc, curr) => acc + (curr.totalListings || 0),
    0
  ),

  avgRating:
    validAgents.length > 0
      ? (
          validAgents.reduce(
            (acc, curr) => acc + (curr.rating || 0),
            0
          ) / validAgents.length
        ).toFixed(1)
      : 0,
};
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-xl w-48" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-2xl"
              />
            ))}
          </div>

          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="
          bg-red-100 text-red-600
          p-4 rounded-xl
        ">
          Failed to load agents
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="
        flex flex-col lg:flex-row
        lg:items-center lg:justify-between
        gap-4
      ">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Agents Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all registered real estate agents
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2 text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-3
              rounded-xl border border-gray-200
              bg-white outline-none
              focus:ring-2 focus:ring-yellow-400
            "
          />
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="
        grid grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">
        <StatsCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={<BadgeCheck size={22} />}
        />

        <StatsCard
          title="Verified Agents"
          value={stats.verifiedAgents}
          icon={<ShieldCheck size={22} />}
        />

        <StatsCard
          title="Total Listings"
          value={stats.totalListings}
          icon={<Building2 size={22} />}
        />

        <StatsCard
          title="Average Rating"
          value={stats.avgRating}
          icon={<Star size={22} />}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="
        bg-white rounded-2xl
        shadow-sm border border-gray-100
        overflow-hidden
      ">

        {/* TABLE HEADER */}
        <div className="
          hidden lg:grid
          grid-cols-5 gap-4
          px-6 py-4
          bg-gray-50 border-b
          text-sm font-semibold text-gray-600
        ">
          <div>Agent</div>
          <div className="text-center">Listings</div>
          <div className="text-center">Deals Closed</div>
          <div className="text-center">Rating</div>
          <div className="text-center">Status</div>
        </div>

        {/* TABLE BODY */}
        {filteredAgents.length > 0 ? (
          filteredAgents.filter((a) => a && a.user).map((a) => (
            <div
              key={a._id}
              className="
                grid grid-cols-1 lg:grid-cols-5
                gap-4 px-6 py-5
                border-b last:border-none
                hover:bg-gray-50 transition
              "
            >
              {/* AGENT */}
              <div className="flex items-center gap-3">
                <div className="
                  w-12 h-12 rounded-full
                  bg-yellow-100 text-yellow-700
                  flex items-center justify-center
                  font-bold uppercase
                ">
                  {a.user?.name?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {a.user?.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Agent ID: {a._id?.slice(-6)}
                  </p>
                </div>
              </div>

              {/* LISTINGS */}
              <div className="
                flex lg:justify-center
                items-center gap-2
              ">
                <span className="lg:hidden font-semibold">
                  Listings:
                </span>

                <span className="font-medium">
                  {a.totalListings || 0}
                </span>
              </div>

              {/* DEALS */}
              <div className="
                flex lg:justify-center
                items-center gap-2
              ">
                <span className="lg:hidden font-semibold">
                  Deals:
                </span>

                <span className="font-medium">
                  {a.dealsClosed || 0}
                </span>
              </div>

              {/* RATING */}
              <div className="
                flex lg:justify-center
                items-center gap-2
              ">
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="font-medium">
                  {a.rating || 0}
                </span>
              </div>

              {/* VERIFIED */}
              <div className="flex lg:justify-center items-center">
                {a.verified ? (
                  <span className="
                    flex items-center gap-2
                    bg-green-100 text-green-700
                    px-3 py-1 rounded-full
                    text-sm font-semibold
                  ">
                    <ShieldCheck size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="
                    flex items-center gap-2
                    bg-red-100 text-red-700
                    px-3 py-1 rounded-full
                    text-sm font-semibold
                  ">
                    <ShieldX size={16} />
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            No agents found
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({ title, value, icon }) {
  return (
    <div className="
      bg-white rounded-2xl p-5
      border border-gray-100 shadow-sm
      hover:shadow-md transition
    ">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="
          bg-yellow-100 text-yellow-700
          p-3 rounded-xl
        ">
          {icon}
        </div>
      </div>
    </div>
  );
}