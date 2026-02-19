"use client";

import { useGetMeQuery } from "@/store/services/authApi";
import { useGetAgentStatsQuery } from "@/store/services/agentApi";
import { useGetAdminStatsQuery } from "@/store/services/adminApi"; // create if not exists
import { useGetSavedPropertiesQuery } from "@/store/services/savedApi";
import Link from "next/link";

export default function ProfileStats() {
  const { data: user } = useGetMeQuery();

  const role = user?.role;
  const agentId = user?.agentProfileId;

  /* ---------------- AGENT STATS ---------------- */
  const { data: agentStats } = useGetAgentStatsQuery(agentId, {
    skip: role !== "agent" || !agentId,
  });

  /* ---------------- ADMIN STATS ---------------- */
  const { data: adminStats } = useGetAdminStatsQuery(undefined, {
    skip: role !== "admin",
  });

  /* ---------------- USER STATS ---------------- */
  const { data: savedData } = useGetSavedPropertiesQuery(undefined, {
    skip: role !== "user",
  });

  if (!user) return null;

  return (
    <div className="px-4 space-y-6 mb-6">
      {/* ================= ROLE BASED STATS ================= */}
      <div className="grid grid-cols-3 gap-4">
        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <StatCard label="Saved" value={savedData?.length ?? 0} />
            <StatCard label="Enquiries" value={user?.enquiryCount ?? 0} />
            <StatCard label="Viewed" value={user?.viewedCount ?? 0} />
          </>
        )}

        {/* ================= AGENT ================= */}
        {role === "agent" && (
          <>
            <StatCard
              label="Properties"
              value={agentStats?.propertiesCount ?? 0}
            />
            <StatCard
              label="Leads"
              value={agentStats?.leadsCount ?? 0}
            />
            <StatCard
              label="Views"
              value={agentStats?.viewsCount ?? 0}
            />
          </>
        )}

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <StatCard label="Users" value={adminStats?.users ?? 0} />
            <StatCard label="Properties" value={adminStats?.properties ?? 0} />
            <StatCard label="Leads" value={adminStats?.leads ?? 0} />
          </>
        )}
      </div>

      {/* ================= AGENT EXTRA CARDS ================= */}
      {role === "agent" && agentStats && (
        <>
          {/* Growth */}
          <div className="bg-gray-300 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm text-slate-300 mb-3">📈 Lead Growth</h3>

            <div className="flex justify-between text-sm">
              <span>This Month: {agentStats?.growth?.leadsThisMonth ?? 0}</span>
              <span>Last Month: {agentStats?.growth?.leadsLastMonth ?? 0}</span>
            </div>
          </div>

          {/* Top Property */}
          {agentStats.topProperty && (
            <div className="bg-slate-200 rounded-2xl p-4 shadow-md">
              <h3 className="text-sm text-slate-800 mb-3">
                🏆 Top Performing Property
              </h3>

              <Link href={`/properties/${agentStats.topProperty._id}`}>
                <div className="flex gap-4 items-center cursor-pointer hover:opacity-95 transition">
                  <div
                    className="w-20 h-20 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${agentStats.topProperty.images?.[0]?.url})`,
                    }}
                  />

                  <div>
                    <p className="font-semibold">
                      {agentStats.topProperty.title}
                    </p>
                    <p className="text-indigo-400 font-bold">
                      ₹{agentStats.topProperty.priceValue?.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-800">
                      {new Intl.NumberFormat("en-IN").format(
                        agentStats.topProperty.viewsCount ?? 0,
                      )}{" "}
                      views
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ================= REUSABLE CARD ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-slate-300 rounded-2xl p-5 text-center border border-white/5 hover:scale-105 transition-all duration-300">
      <p className="text-3xl font-bold text-indigo-400">
        {new Intl.NumberFormat("en-IN").format(value)}
      </p>
      <p className="text-xs text-slate-600 mt-2 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
