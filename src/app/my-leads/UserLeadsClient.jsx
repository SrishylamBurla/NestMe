"use client";

import { useState, useMemo } from "react";
import { useGetUserLeadsQuery } from "@/store/services/authApi";
import { useUpdateLeadStatusMutation } from "@/store/services/LeadApi";
import { useRouter } from "next/navigation";

export default function UserLeadsClient() {
  const { data, isLoading, isError } = useGetUserLeadsQuery();
  const [updateStatus] = useUpdateLeadStatusMutation();
  const router = useRouter();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const processedLeads = useMemo(() => {
    if (!data?.leads) return [];

    return [...data.leads]
      .filter((lead) =>
        filter === "all" ? true : lead.status === filter
      )
      .filter((lead) =>
        lead.user?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.property?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [data, filter, search]);

  if (isError)
    return (
      <p className="p-4 text-red-500">
        Failed to load leads
      </p>
    );

  return (
    <section className="space-y-8">

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by user or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 px-4 rounded-full border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
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

      {/* Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-3xl h-40 shadow-md"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && processedLeads.length === 0 && (
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 text-center shadow-md text-slate-500">
          No leads found.
        </div>
      )}

      {/* Leads */}
      <div className="space-y-6">

        {processedLeads.map((lead) => (
          <div
            key={lead._id}
            onClick={() => {
              if (lead.property?._id) {
                router.push(`/properties/${lead.property._id}`);
              }
            }}
            className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-lg text-slate-800">
                  {lead.user?.name}
                </p>
                <p className="text-sm text-slate-500">
                  {lead.user?.email}
                </p>
                <p className="text-sm text-slate-500">
                  {lead.phone || "No phone provided"}
                </p>
              </div>

              <span className="text-xs text-slate-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Message */}
            {lead.message && (
              <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100">
                <p className="text-sm text-slate-700 italic">
                  “{lead.message}”
                </p>
              </div>
            )}

            {/* Property */}
            {lead.property && (
              <div className="mt-4 p-4 bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                <p className="font-semibold text-slate-800">
                  {lead.property.title}
                </p>
                <p className="text-sm text-slate-500">
                  ₹ {lead.property.priceLabel} •{" "}
                  {lead.property.city}
                </p>
              </div>
            )}

            {/* Status + Buttons */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                  lead.status === "new"
                    ? "bg-gray-200 text-gray-800"
                    : lead.status === "contacted"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {lead.status}
              </span>

              <div className="flex gap-2">
                {["new", "contacted", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus({
                        leadId: lead._id,
                        status,
                      });
                    }}
                    className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                  >
                    {status}
                  </button>
                ))}
              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
