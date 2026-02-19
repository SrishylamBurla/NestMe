"use client";

import { useState, useMemo } from "react";
import { useGetMyEnquiriesQuery } from "@/store/services/authApi";
import { useRouter } from "next/navigation";

export default function MyEnquiriesPage() {
  const { data, isLoading, isError } = useGetMyEnquiriesQuery();
  const router = useRouter();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // 🔎 Filtering + Searching + Sorting
  const processedEnquiries = useMemo(() => {
    if (!data?.enquiries) return [];

    return [...data.enquiries]
      .filter((e) =>
        filter === "all" ? true : e.status === filter
      )
      .filter((e) =>
        e.property?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [data, filter, search]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load enquiries
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center border-b border-slate-200 pb-4">

        <button
      onClick={() => window.location.href = "/"}
      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shadow-sm"
    >
      <span className="material-symbols-outlined text-slate-700">
        arrow_back
      </span>
    </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Enquiries
          </h1>

          <span className="text-sm text-slate-500">
            {processedEnquiries.length} Results
          </span>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by property title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {["all", "new", "contacted", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === status
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Skeleton Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-3xl h-72 shadow-md"
              />
            ))}
          </div>
        )}

        {/* Cards */}
        {!isLoading && processedEnquiries.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 text-center shadow-md text-slate-500">
            No enquiries found.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {processedEnquiries.map((e) => (
            <div
              key={e._id}
              onClick={() => {
                if (e.property?._id) {
                  router.push(`/properties/${e.property._id}`);
                }
              }}
              className="relative overflow-hidden group cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200"
            >
              {/* Ripple */}
              <span className="absolute inset-0 opacity-0 group-active:opacity-20 bg-indigo-500 transition duration-200" />

              {/* Image */}
              {e.property?.images?.[0] && (
                <div
                  className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${e.property.images[0]})`,
                  }}
                />
              )}

              <div className="p-5 space-y-3 border-t border-slate-100">

                <h2 className="font-semibold text-lg text-slate-800 line-clamp-1">
                  {e.property?.title}
                </h2>

                <p className="text-sm text-slate-500">
                  Contact:{" "}
                  {e.agent?.user?.name || e.owner?.name || "Property Owner"}
                </p>

                <p className="text-xs text-slate-400">
                  Enquired on{" "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>

                {e.message && (
                  <p className="text-sm italic text-slate-600 line-clamp-2">
                    “{e.message}”
                  </p>
                )}

                {/* Status Badge */}
                <div>
                  {e.status === "new" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                      New
                    </span>
                  )}
                  {e.status === "contacted" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                      Contacted
                    </span>
                  )}
                  {e.status === "closed" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Closed
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
