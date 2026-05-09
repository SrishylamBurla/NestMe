// "use client";

// import Link from "next/link";
// import { ChevronLeft } from "lucide-react"

// export default function AdminLayout({ children }) {
//   return (
//     <div className="flex min-h-screen">

//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-64 bg-black text-white p-6 space-y-3">

//         <div className="flex gap-4">
//           {/* 🔙 Back to Home */}
//         <Link
//           href="/"
//           className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 rounded-full p-2 hover:text-white transition"
//         >
//           <ChevronLeft size={18} strokeWidth={2} />
//         </Link>

//         {/* Heading */}
//         <h2 className="text-xl font-bold tracking-wide pt-2">
//           Admin Panel
//         </h2>
//         </div>

//         {/* Navigation */}
//         <nav className="space-y-3 pt-4">
//           <Nav link="/admin/dashboard" label="Dashboard" />
//           <Nav link="/admin/users" label="Users" />
//           <Nav link="/admin/agents" label="Agents" />
//           <Nav link="/admin/properties" label="Properties" />
//           <Nav link="/admin/leads" label="Leads" />
//           <Nav link="/admin/subscriptions" label="Subscriptions" />
//           <Nav link="/admin/pending-properties" label="Pending Approvals" />
//           <Nav link="/admin/support" label="Support" />
//         </nav>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 p-8 bg-gray-100">
//         {children}
//       </main>
//     </div>
//   );
// }

// function Nav({ link, label }) {
//   return (
//     <Link
//       href={link}
//       className="block text-gray-400 hover:text-yellow-400 transition"
//     >
//       {label}
//     </Link>
//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BadgeDollarSign,
  FileClock,
  Headset,
  BarChart3,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      link: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      link: "/admin/users",
      label: "Users",
      icon: <Users size={18} />,
    },
    {
      link: "/admin/agents",
      label: "Agents",
      icon: <UserCheck size={18} />,
    },
    {
      link: "/admin/properties",
      label: "Properties",
      icon: <Building2 size={18} />,
    },
    {
      link: "/admin/leads",
      label: "Leads",
      icon: <BarChart3 size={18} />,
    },
    {
      link: "/admin/subscriptions",
      label: "Subscriptions",
      icon: <BadgeDollarSign size={18} />,
    },
    {
      link: "/admin/pending-properties",
      label: "Pending",
      icon: <FileClock size={18} />,
    },
    {
      link: "/admin/support",
      label: "Support",
      icon: <Headset size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-72 bg-black text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
            >
              <ChevronLeft size={18} />
            </Link>

            <h2 className="text-xl font-bold">
              Admin Panel
            </h2>
          </div>

          {/* Close Button Mobile */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <Nav
              key={index}
              link={item.link}
              label={item.label}
              icon={item.icon}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ================= TOPBAR ================= */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between lg:hidden">

          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <h1 className="font-semibold text-lg">
            Admin Panel
          </h1>

          <div />
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function Nav({ link, label, icon, onClick }) {
  return (
    <Link
      href={link}
      onClick={onClick}
      className="
        flex items-center gap-3
        px-4 py-3 rounded-xl
        text-gray-300
        hover:bg-yellow-400
        hover:text-black
        transition-all duration-200
      "
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}