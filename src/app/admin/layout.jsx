"use client";

import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-black text-white p-6 space-y-3">

        <div className="flex gap-4">
          {/* 🔙 Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 rounded-full p-2 hover:text-white transition"
        >
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
        </Link>

        {/* Heading */}
        <h2 className="text-xl font-bold tracking-wide pt-2">
          Admin Panel
        </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 pt-4">
          <Nav link="/admin/dashboard" label="Dashboard" />
          <Nav link="/admin/users" label="Users" />
          <Nav link="/admin/agents" label="Agents" />
          <Nav link="/admin/properties" label="Properties" />
          <Nav link="/admin/leads" label="Leads" />
          <Nav link="/admin/subscriptions" label="Subscriptions" />
          <Nav link="/admin/pending-properties" label="Pending Approvals" />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}

function Nav({ link, label }) {
  return (
    <Link
      href={link}
      className="block text-gray-400 hover:text-yellow-400 transition"
    >
      {label}
    </Link>
  );
}
