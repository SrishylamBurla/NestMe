"use client";

import { useState, useMemo } from "react";
import { useGetMyPropertiesQuery } from "@/store/services/authApi";
import UserPropertyCard from "@/components/UserPropertyCard";

export default function MyPropertiesPage() {
  const { data, isLoading } = useGetMyPropertiesQuery();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const processedProperties = useMemo(() => {
    if (!data?.properties) return [];

    let props = [...data.properties];

    /* ---------- FILTER ---------- */
    if (filter !== "all") {
      props = props.filter((p) => {
        if (filter === "pending") return p.approvalStatus === "pending";
        if (filter === "rejected") return p.approvalStatus === "rejected";

        return (
          p.approvalStatus === "approved" &&
          p.listingStatus === filter
        );
      });
    }

    /* ---------- SEARCH ---------- */
    props = props.filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase())
    );

    /* ---------- SORT ---------- */
    if (sort === "latest") {
      props.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      props.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "priceHigh") {
      props.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sort === "priceLow") {
      props.sort((a, b) => a.priceValue - b.priceValue);
    }

    return props;
  }, [data, filter, search, sort]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading properties...
      </div>
    );
  }

  const filterLabels = {
    all: "properties",
    available: "available properties",
    rented: "rented properties",
    sold: "sold properties",
    pending: "pending properties",
    rejected: "rejected properties",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
         <div className="flex gap-4">
            <button
      onClick={() => window.location.href = "/"}
      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shadow-sm"
    >
      <span className="material-symbols-outlined text-slate-700">
        arrow_back
      </span>
    </button>
          <h1 className="text-3xl font-bold text-slate-800">
            My Properties
          </h1>
         </div>

          <span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border">
            {processedProperties.length} Listings
          </span>
        </div>

        {/* ================= SEARCH + SORT ================= */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-11 px-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 px-4 rounded-xl border border-slate-300 bg-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="priceLow">Price Low → High</option>
          </select>
        </div>

        {/* ================= FILTER TABS ================= */}
        <div className="flex flex-wrap gap-3">
          {["all","available","rented","sold","pending","rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {processedProperties.length === 0 && (
          <div className="bg-white border p-10 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              No {filterLabels[filter]}
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              {filter === "all"
                ? "You haven't added any properties yet."
                : `You don't have any ${filterLabels[filter]} right now.`}
            </p>
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {processedProperties.map((p) => (
            <UserPropertyCard key={p._id} property={p} />
          ))}
        </div>

      </div>
    </div>
  );
}
