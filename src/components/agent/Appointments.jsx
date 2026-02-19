"use client";

import { useGetMeQuery } from "@/store/services/authApi";
import { useGetAgentAppointmentsQuery } from "@/store/services/agentApi";

export default function Appointments() {
  const { data: user } = useGetMeQuery();

  const { data, isLoading } = useGetAgentAppointmentsQuery(
    user?.agentProfileId,
    { skip: !user?.agentProfileId }
  );

  if (isLoading) return <Skeleton />;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Appointments</h2>
        <span className="text-xs sm:text-sm text-gray-500">
          Upcoming Visits
        </span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data?.appointments?.length === 0 && (
          <div className="bg-white dark:bg-[#1c2936] rounded-xl p-6 text-center text-gray-500 shadow-sm">
            No upcoming appointments
          </div>
        )}

        {data?.appointments?.map((a) => (
          <div
            key={a._id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1c2936] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition"
          >
            {/* Time Block */}
            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center min-w-[80px]">
              <p className="text-sm font-bold text-blue-600">
                {new Date(a.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(a.date).toLocaleDateString()}
              </p>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h4 className="font-semibold text-base capitalize">
                {a.type.replace("-", " ")}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-1">
                {a.property?.title} • {a.property?.city}
              </p>
              <p className="text-xs mt-1 text-gray-400">
                Lead: {a.lead?.name} • {a.lead?.phone}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 sm:gap-2 justify-end">
              <button className="h-10 w-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
                📞
              </button>
              <button className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                💬
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Skeleton Loader */
function Skeleton() {
  return (
    <div className="px-4 py-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
}
