"use client";

import { useGetMeQuery } from "@/store/services/authApi";
import { useGetAgentStatsQuery } from "@/store/services/agentApi";
import { useGetAdminStatsQuery } from "@/store/services/adminApi";
import { useGetSavedPropertiesQuery } from "@/store/services/savedApi";
import Link from "next/link";

/* ================= MAIN ================= */
export default function ProfileStats() {
  const { data } = useGetMeQuery();
  const user = data?.user;

  const role = user?.role;
  const agentId = user?.agentProfileId;

  const { data: agentStats } = useGetAgentStatsQuery(agentId, {
    skip: role !== "agent" || !agentId,
  });

  const { data: adminStats } = useGetAdminStatsQuery(undefined, {
    skip: role !== "admin",
  });

  const { data: savedData } = useGetSavedPropertiesQuery(undefined, {
    skip: role !== "user",
  });

  if (!user) return null;

  return (
    <div className="px-4 space-y-6 mb-6">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          Insights
        </h2>
        <span className="text-xs text-gray-400">Live data</span>
      </div>

      {/* ===== MAIN STATS ===== */}
      <div className="grid grid-cols-3 gap-4">

        {/* AGENT */}
        {role === "agent" && (
          <>
            <StatCard
              label="Properties"
              value={agentStats?.propertiesCount ?? 0}
              icon="home"
              color="from-indigo-500 to-blue-600"
            />
            <StatCard
              label="Leads"
              value={agentStats?.leadsCount ?? 0}
              icon="group"
              color="from-emerald-500 to-green-600"
            />
            <StatCard
              label="Views"
              value={agentStats?.viewsCount ?? 0}
              icon="visibility"
              color="from-purple-500 to-pink-500"
            />
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <StatCard label="Users" value={adminStats?.users ?? 0} icon="person" color="from-indigo-500 to-blue-600" />
            <StatCard label="Properties" value={adminStats?.properties ?? 0} icon="home" color="from-emerald-500 to-green-600" />
            <StatCard label="Leads" value={adminStats?.leads ?? 0} icon="group" color="from-purple-500 to-pink-500" />
          </>
        )}
      </div>

      {/* ===== AGENT ADVANCED ===== */}
      {role === "agent" && agentStats && (
        <>
          {/* GROWTH CARD */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm opacity-80">Lead Growth</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Monthly
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xl font-bold">
                  {agentStats?.growth?.leadsThisMonth ?? 0}
                </p>
                <p className="text-xs opacity-70">This Month</p>
              </div>

              <div>
                <p className="text-xl font-bold opacity-80">
                  {agentStats?.growth?.leadsLastMonth ?? 0}
                </p>
                <p className="text-xs opacity-70">Last Month</p>
              </div>
            </div>
          </div>

          {/* TOP PROPERTY */}
          {agentStats.topProperty && (
            <Link href={`/properties/${agentStats.topProperty._id}`}>
              <div className="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center hover:shadow-lg transition cursor-pointer">

                <div
                  className="w-20 h-20 rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${agentStats.topProperty.images?.[0]?.url})`,
                  }}
                />

                <div className="flex-1">
                  <p className="font-semibold text-slate-900 line-clamp-1">
                    {agentStats.topProperty.title}
                  </p>

                  <p className="text-indigo-600 font-bold text-sm">
                    ₹{agentStats.topProperty.priceValue?.toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat("en-IN").format(
                      agentStats.topProperty.viewsCount ?? 0
                    )}{" "}
                    views
                  </p>
                </div>

                <span className="material-symbols-outlined text-gray-400">
                  chevron_right
                </span>
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

/* ================= PREMIUM CARD ================= */
function StatCard({ label, value, icon, color }) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl shadow-lg">

      <div className="bg-white/80 rounded-2xl p-4 text-center">

        {/* ICON */}
        <div
          className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
        >
          <span className="material-symbols-outlined text-white text-sm">
            {icon}
          </span>
        </div>

        {/* VALUE */}
        <p className="text-2xl font-bold text-slate-900">
          {new Intl.NumberFormat("en-IN").format(value)}
        </p>

        {/* LABEL */}
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}