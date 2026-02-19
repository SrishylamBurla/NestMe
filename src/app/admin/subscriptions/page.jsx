"use client";

import { useGetSubscriptionsQuery } from "@/store/services/adminApi";

export default function AdminSubscriptionsPage() {
  const { data, isLoading, isError } = useGetSubscriptionsQuery();

  if (isLoading) return <p className="p-6">Loading subscriptions...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Subscriptions</h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-center">Plan</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {data?.subscriptions?.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.user?.name}</td>
                <td className="p-3 text-center">{s.plan}</td>
                <td className="p-3 text-center capitalize">{s.status}</td>
                <td className="p-3 text-center">
                  {new Date(s.expiresAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
