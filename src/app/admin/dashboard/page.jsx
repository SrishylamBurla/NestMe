"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card title="Users" value={stats.users} />
      <Card title="Agents" value={stats.agents} />
      <Card title="Properties" value={stats.properties} />
      <Card title="Leads" value={stats.leads} />
      <Card title="Revenue" value={`₹${stats.revenue}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
