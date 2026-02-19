"use client";

import { useGetAgentsQuery } from "@/store/services/adminApi";

export default function AdminAgentsPage() {
  const { data, isLoading, isError } = useGetAgentsQuery();

  if (isLoading) return <p className="p-6">Loading agents...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load agents</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Agents</h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Agent</th>
              <th className="p-3 text-center">Listings</th>
              <th className="p-3 text-center">Deals Closed</th>
              <th className="p-3 text-center">Rating</th>
              <th className="p-3 text-center">Verified</th>
            </tr>
          </thead>
          <tbody>
            {data?.agents?.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-3">{a.user?.name}</td>
                <td className="p-3 text-center">{a.totalListings}</td>
                <td className="p-3 text-center">{a.dealsClosed}</td>
                <td className="p-3 text-center">{a.rating}</td>
                <td className="p-3 text-center">
                  {a.verified ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
