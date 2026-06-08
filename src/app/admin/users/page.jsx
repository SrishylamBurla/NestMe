
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));
  }, []);

  // ================= FILTER USERS =================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const roleMap = {
        users: "user",
        agents: "agent",
        admins: "admin",
      };

      const matchesRole =
        activeTab === "all"
          ? true
          : u.role?.toLowerCase() === roleMap[activeTab];

      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search);

      return matchesRole && matchesSearch;
    });
  }, [users, activeTab, search]);

  const counts = {
    users: users.filter((u) => u.role === "user").length,
    agents: users.filter((u) => u.role === "agent").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage users, agents and admins
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatsCard
          title="Users"
          value={counts.users}
          icon={<Users size={22} />}
        />

        <StatsCard
          title="Agents"
          value={counts.agents}
          icon={<UserCheck size={22} />}
        />

        <StatsCard
          title="Admins"
          value={counts.admins}
          icon={<ShieldCheck size={22} />}
        />
      </div>

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-3">

        <TabButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
          label="Users"
        />

        <TabButton
          active={activeTab === "agents"}
          onClick={() => setActiveTab("agents")}
          label="Agents"
        />

        <TabButton
          active={activeTab === "admins"}
          onClick={() => setActiveTab("admins")}
          label="Admins"
        />

        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          label="All"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-600">
          <div>User</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Role</div>
        </div>

        {/* USERS */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="
                grid grid-cols-1 md:grid-cols-4
                gap-4 px-6 py-5
                border-b last:border-none
                hover:bg-gray-50 transition
              "
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <div className="
                  w-11 h-11 rounded-full
                  bg-yellow-100 text-yellow-700
                  flex items-center justify-center
                  font-bold uppercase
                ">
                  {u.name?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {u.name}
                  </h3>

                  <p className="text-sm text-gray-500 md:hidden">
                    {u.role}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="break-all">
                  {u.email || "N/A"}
                </span>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>
                  {u.phone || "N/A"}
                </span>
              </div>

              {/* ROLE */}
              <div className="flex items-center">
                <RoleBadge role={u.role} />
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({ title, value, icon }) {
  return (
    <div className="
      bg-white rounded-2xl p-5
      border border-gray-100 shadow-sm
    ">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="
          bg-yellow-100 text-yellow-700
          p-3 rounded-xl
        ">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================= TAB BUTTON ================= */

function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-xl font-medium transition
        ${active
          ? "bg-black text-white"
          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
}

/* ================= ROLE BADGE ================= */

function RoleBadge({ role }) {
  const styles = {
    users: "bg-blue-100 text-blue-700",
    agents: "bg-green-100 text-green-700",
    admins: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full
        text-sm font-semibold capitalize
        ${styles[role] || "bg-gray-100 text-gray-700"}
      `}
    >
      {role}
    </span>
  );
}