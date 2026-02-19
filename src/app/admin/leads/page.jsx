"use client";

import { useGetAllLeadsQuery } from "@/store/services/adminApi";

export default function AdminLeadsPage() {
  const { data, isLoading, isError } = useGetAllLeadsQuery();

  if (isLoading) return <p className="p-6">Loading leads...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading leads</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-center">Agent</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.leads?.map((l) => (
              <tr key={l._id} className="border-t">
                <td className="p-3">{l.user?.name}</td>
                <td className="p-3">{l.property?.title}</td>
                <td className="p-3 text-center">{l.agent?.user?.name}</td>
                <td className="p-3 text-center capitalize">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
