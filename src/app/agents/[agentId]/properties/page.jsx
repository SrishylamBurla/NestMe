"use client";

import { useState, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";
import AgentPropertyCard from "@/components/agent/AgentPropertyCard";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AgentPropertiesPage() {
  // ✅ FIXED: correct structure
  const { data, isLoading: userLoading } = useGetMeQuery();
  const user = data?.user;
  const agentId = user?.agentProfileId;

  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    isError,
  } = useGetAgentPropertiesQuery(agentId ?? skipToken);

  const processedProperties = useMemo(() => {
    if (!propertiesData?.properties) return [];

    let props = [...propertiesData.properties];

    // FILTER
    if (filter !== "all") {
      props = props.filter((p) => {
        if (filter === "pending") return p.approvalStatus === "pending";
        if (filter === "rejected") return p.approvalStatus === "rejected";
        if (filter === "approved") return p.approvalStatus === "approved";
        return true;
      });
    }

    // SEARCH
    props = props.filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase())
    );

    // SORT
    if (sort === "latest") {
      props.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      props.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "priceHigh") {
      props.sort((a, b) => (b.priceValue || 0) - (a.priceValue || 0));
    } else if (sort === "priceLow") {
      props.sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));
    }

    return props;
  }, [propertiesData, filter, search, sort]);

  // ✅ LOADING FIX
  if (userLoading || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading properties…
      </div>
    );
  }

  if (!user) {
    return <p className="p-4">Not logged in</p>;
  }

  if (isError) {
    return <p className="p-4 text-red-500">Failed to load properties</p>;
  }

  return (
    <section className="min-h-screen  mobile-safe-top bg-gradient-to-br from-indigo-200 via-violet-200 to-purple-200 px-4 pb-4">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* HEADER */}
        <div className="flex items-center justify-between py-2">
          <Link
            href="/"
            className="text cursor-pointer bg-gray-50 rounded-full p-2 hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-2xl font-bold text-center text-indigo-600">
            My Properties
          </h1>

          <div className="text-sm text-slate-600">
            {processedProperties.length} Listings
          </div>
        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-row gap-2 items-center">

          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-8 px-4 rounded-lg bg-gray-50"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-8 px-2 rounded-lg bg-gray-50"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priceHigh">High → Low</option>
            <option value="priceLow">Low → High</option>
          </select>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 flex-wrap">
          {["all", "approved", "pending", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-2 py-1 rounded-lg ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {processedProperties.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No properties found
          </div>
        )}

        {/* ✅ FIXED GRID (NO EXTRA DIV) */}
        {processedProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {processedProperties.map((property) => (
              <AgentPropertyCard
                key={property._id}
                property={property}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}