"use client";

import { useMemo, useState } from "react";

import { useGetSubscriptionsQuery } from "@/store/services/adminApi";

import {
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  Crown,
  Users,
} from "lucide-react";

export default function AdminSubscriptionsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useGetSubscriptionsQuery();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const subscriptions =
    data?.subscriptions || [];

  const getSubscriptionStatus = (subscription) => {
    if (!subscription.endDate) return "pending";

    return new Date(subscription.endDate) < new Date()
      ? "expired"
      : "active";
  };

  // ================= FILTER =================
  const filteredSubscriptions =
    useMemo(() => {
      let filtered =
        subscriptions;

      // STATUS FILTER
      if (filter !== "all") {
        filtered = filtered.filter(
          (s) =>
            getSubscriptionStatus(s) === filter
        );
      }

      // SEARCH FILTER
      if (search.trim()) {
        filtered = filtered.filter(
          (s) =>
            s.user?.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            s.plan
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
      }

      return filtered;
    }, [
      subscriptions,
      search,
      filter,
    ]);

  // ================= STATS =================
  const stats = {
    total:
      subscriptions.length,

    active: subscriptions.filter(
      (s) => getSubscriptionStatus(s) === "active"
    ).length,

    expired: subscriptions.filter(
      (s) => getSubscriptionStatus(s) === "expired"
    ).length,

    pending:
      subscriptions.filter(
        (s) =>
          s.status === "pending"
      ).length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Loading subscriptions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading subscriptions
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Subscription Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all subscription plans
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
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
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
          title="Total Subscriptions"
          value={stats.total}
          icon={<Users size={22} />}
        />

        <StatsCard
          title="Active"
          value={stats.active}
          icon={
            <CheckCircle2
              size={22}
            />
          }
        />

        <StatsCard
          title="Expired"
          value={stats.expired}
          icon={<XCircle size={22} />}
        />

        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock3 size={22} />}
        />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          "all",
          "active",
          "pending",
          "expired",
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
              ${filter === tab
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
          <table className="w-full min-w-[1000px]">

            <thead className="bg-gray-50 border-b">
              <tr className="text-sm text-gray-600">

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-center">
                  Plan
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Joined
                </th>

                <th className="p-4 text-center">
                  Expiry
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscriptions.map(
                (s) => (
                  <tr
                    key={s._id}
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
                          {s.user?.name?.charAt(
                            0
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {
                              s.user?.name
                            }
                          </h3>
                        </div>
                      </div>
                    </td>

                    {/* PLAN */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Crown
                          size={16}
                          className="text-yellow-500"
                        />

                        <span className="font-medium capitalize">
                          {s.plan}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">
                      <StatusBadge
                        status={getSubscriptionStatus(s)}
                      />
                    </td>

                    {/* JOINED */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-gray-400"
                        />
                        {new Date(
                          s.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* EXPIRY */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-gray-400"
                        />

                        <span>
                          {new Date(
                            s.endDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="lg:hidden space-y-4">
        {filteredSubscriptions.map(
          (s) => (
            <div
              key={s._id}
              className="
              relative
                bg-white rounded-2xl
                border border-gray-100
                shadow-sm p-4
              "
            >

              {/* STATUS */}
              <div className="absolute top-3 right-3">
                <StatusBadge
                  status={s.status}
                />
              </div>

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
                  {s.user?.name?.charAt(
                    0
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {s.user?.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Subscriber
                  </p>
                </div>
              </div>

              {/* PLAN */}
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Plan
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <Crown
                    size={16}
                    className="text-yellow-500"
                  />

                  <span className="font-medium capitalize">
                    {s.plan}
                  </span>
                </div>
              </div>


              <div className="flex flex-row justify-between items-center">
                {/* JOINED */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Joined Date
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="font-medium">
                      {new Date(
                        s.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>




                {/* EXPIRY */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Expiry Date
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="font-medium">
                      {new Date(
                        s.endDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

              </div>


            </div>
          )
        )}
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({
  status,
}) {
  if (status === "active") {
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
        Active
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span
        className="
          inline-flex items-center gap-2
          px-3 py-1 rounded-full
          bg-red-100 text-red-700
          text-sm font-medium
        "
      >
        <XCircle size={15} />
        Expired
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
      Pending
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