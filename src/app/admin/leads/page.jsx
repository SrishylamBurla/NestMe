
"use client";

import { useMemo, useState } from "react";

import { useGetAllLeadsQuery } from "@/store/services/adminApi";

import {
  Search,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  PhoneCall,
  Building2,
  UserCheck,
} from "lucide-react";

export default function AdminLeadsPage() {
  const { data, isLoading, isError } =
    useGetAllLeadsQuery();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const leads = data?.leads || [];

  // ================= FILTER =================
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // STATUS FILTER
    if (filter !== "all") {
      filtered = filtered.filter(
        (l) =>
          l.status?.toLowerCase() ===
          filter
      );
    }

    // SEARCH FILTER
    if (search.trim()) {
      filtered = filtered.filter(
        (l) =>
          l.user?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          l.property?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          l.agent?.user?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    return filtered;
  }, [leads, search, filter]);

  // ================= STATS =================
  const stats = {
    total: leads.length,

    new: leads.filter(
      (l) => l.status === "new"
    ).length,

    contacted: leads.filter(
      (l) =>
        l.status === "contacted"
    ).length,

    closed: leads.filter(
      (l) => l.status === "closed"
    ).length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading leads
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Leads Management
          </h1>

          <p className="text-gray-500 mt-1">
            Track all customer leads
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
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
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
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        <StatsCard
          title="Total Leads"
          value={stats.total}
          icon={<Users size={22} />}
        />

        <StatsCard
          title="New Leads"
          value={stats.new}
          icon={<Clock3 size={22} />}
        />

        <StatsCard
          title="Contacted"
          value={stats.contacted}
          icon={<PhoneCall size={22} />}
        />

        <StatsCard
          title="Closed"
          value={stats.closed}
          icon={<CheckCircle2 size={22} />}
        />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          "all",
          "new",
          "contacted",
          "closed",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setFilter(tab)
            }
            className={`
              px-4 py-2.5 rounded-xl
              whitespace-nowrap
              text-sm font-medium
              transition
              ${
                filter === tab
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {tab.charAt(0).toUpperCase() +
              tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div
        className="
          hidden lg:block
          bg-white rounded-2xl
          border border-gray-100
          shadow-sm overflow-hidden
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">

            <thead className="bg-gray-50 border-b">
              <tr className="text-sm text-gray-600">

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Property
                </th>

                <th className="p-4 text-left">
                  Agent
                </th>

                <th className="p-4 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((l) => (
                <tr
                  key={l._id}
                  className="
                    border-b
                    hover:bg-gray-50
                    transition
                  "
                >
                  {/* USER */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-10 h-10 rounded-full
                          bg-yellow-100
                          text-yellow-700
                          flex items-center
                          justify-center
                          font-semibold
                        "
                      >
                        {l.user?.name?.charAt(
                          0
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {l.user?.name}
                        </h3>
                      </div>
                    </div>
                  </td>

                  {/* PROPERTY */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2
                        size={16}
                        className="text-gray-400"
                      />

                      <span>
                        {
                          l.property?.title
                        }
                      </span>
                    </div>
                  </td>

                  {/* AGENT */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <UserCheck
                        size={16}
                        className="text-gray-400"
                      />

                      <span>
                        {
                          l.agent?.user
                            ?.name
                        }
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4 text-center">
                    <StatusBadge
                      status={l.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="lg:hidden space-y-4">
        {filteredLeads.map((l) => (
          <div
            key={l._id}
            className="
              bg-white rounded-2xl
              border border-gray-100
              shadow-sm p-4
            "
          >

            {/* USER */}
            <div className="flex items-center gap-3">

              <div
                className="
                  w-12 h-12 rounded-full
                  bg-yellow-100
                  text-yellow-700
                  flex items-center justify-center
                  font-semibold text-lg
                "
              >
                {l.user?.name?.charAt(
                  0
                )}
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {l.user?.name}
                </h2>

                <p className="text-sm text-gray-500">
                  Lead User
                </p>
              </div>
            </div>

            {/* PROPERTY */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Property
              </p>

              <div className="flex items-center gap-2 mt-1">
                <Building2
                  size={16}
                  className="text-gray-400"
                />

                <span className="font-medium">
                  {
                    l.property?.title
                  }
                </span>
              </div>
            </div>

            {/* AGENT */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Agent
              </p>

              <div className="flex items-center gap-2 mt-1">
                <UserCheck
                  size={16}
                  className="text-gray-400"
                />

                <span className="font-medium">
                  {
                    l.agent?.user
                      ?.name
                  }
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className="mt-5">
              <StatusBadge
                status={l.status}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  if (status === "closed") {
    return (
      <span
        className="
          inline-flex items-center gap-2
          px-3 py-1 rounded-full
          bg-green-100 text-green-700
          text-sm font-medium
        "
      >
        <CheckCircle2 size={15} />
        Closed
      </span>
    );
  }

  if (status === "contacted") {
    return (
      <span
        className="
          inline-flex items-center gap-2
          px-3 py-1 rounded-full
          bg-blue-100 text-blue-700
          text-sm font-medium
        "
      >
        <PhoneCall size={15} />
        Contacted
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex items-center gap-2
        px-3 py-1 rounded-full
        bg-yellow-100 text-yellow-700
        text-sm font-medium
      "
    >
      <Clock3 size={15} />
      New
    </span>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        bg-white rounded-2xl
        p-5 border border-gray-100
        shadow-sm hover:shadow-md
        transition
      "
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className="
            bg-yellow-100 text-yellow-700
            p-3 rounded-xl
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}