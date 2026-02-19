"use client";
import { useState, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAgentPropertiesQuery } from "@/store/services/agentApi";
import { useGetMeQuery } from "@/store/services/authApi";
import AgentPropertyCard from "@/components/agent/AgentPropertyCard";
import { useRouter } from "next/navigation";

export default function AgentPropertiesPage() {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const agentId = user?.agentProfileId;

  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const {
    data,
    isLoading: propertiesLoading,
    isError,
  } = useGetAgentPropertiesQuery(agentId ?? skipToken);

  const processedProperties = useMemo(() => {
    if (!data?.properties) return [];

    let props = [...data.properties];

    // FILTER LOGIC (Same as User Page)
    if (filter !== "all") {
      props = props.filter((p) => {
        // approval filters
        if (filter === "pending") return p.approvalStatus === "pending";

        if (filter === "rejected") return p.approvalStatus === "rejected";

        // approved + listing
        if (filter === "approved") return p.approvalStatus === "approved";

        return true;
      });
    }

    // SEARCH
    props = props.filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase()),
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
  }, [data, filter, search, sort]);

  if (userLoading || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading properties…
      </div>
    );
  }

  if (isError) {
    return <p className="p-4 text-red-500">Failed to load properties</p>;
  }
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-200 via-violet-200 to-purple-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-1 py-1 rounded-full bg-gray-600 shadow hover:shadow-md text-gray-100 hover:bg-gray-700 transition"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
          </button>

          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Properties
          </h1>

          <div className="text-sm text-slate-600">
            {processedProperties.length} Listings
          </div>
        </div>

        {/* Search + Sort */}
        {/* Search + Sort */}
<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

  <div className="flex flex-col md:flex-row md:items-center gap-4">

    {/* Search */}
    <div className="relative flex-1">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        search
      </span>

      <input
        type="text"
        placeholder="Search properties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-11 pl-12 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>

    {/* Sort */}
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="h-11 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
    >
      <option value="latest">Sort: Latest</option>
      <option value="oldest">Sort: Oldest</option>
      <option value="priceHigh">Price: High → Low</option>
      <option value="priceLow">Price: Low → High</option>
    </select>

  </div>
</div>



        <div className="flex gap-3 flex-wrap pt-2">

  {["all", "approved", "pending", "rejected"].map((status) => (
    <button
      key={status}
      onClick={() => setFilter(status)}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
        filter === status
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}

</div>


        {/* Empty State */}
        {processedProperties.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-md text-center space-y-3">
            <div className="text-4xl">
              {filter === "pending" && "⏳"}
              {filter === "rejected" && "❌"}
              {filter === "approved" && "✅"}
              {filter === "all" && "📦"}
            </div>

            <h3 className="text-lg font-semibold text-slate-700">
              No {filter} properties
            </h3>

            <p className="text-sm text-slate-500">
              {filter === "all"
                ? "You haven't added any properties yet."
                : `You don't have any ${filter} properties right now.`}
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        {processedProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {processedProperties.map((property) => (
              <div key={property._id}>
                <AgentPropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
