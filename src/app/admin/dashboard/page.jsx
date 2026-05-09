
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Building2,
  BarChart3,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = [
    {
      title: "Users",
      value: stats.users || 0,
      icon: <Users size={24} />,
    },
    {
      title: "Agents",
      value: stats.agents || 0,
      icon: <UserCheck size={24} />,
    },
    {
      title: "Properties",
      value: stats.properties || 0,
      icon: <Building2 size={24} />,
    },
    {
      title: "Leads",
      value: stats.leads || 0,
      icon: <BarChart3 size={24} />,
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue || 0}`,
      icon: <IndianRupee size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div
      className="
        bg-white rounded-2xl p-5
        shadow-sm border border-gray-100
        hover:shadow-lg transition
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}