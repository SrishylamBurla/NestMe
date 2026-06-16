
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      link: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      link: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      link: "/admin/agents",
      label: "Agents",
      icon: UserCheck,
    },
    {
      link: "/admin/properties",
      label: "Properties",
      icon: Building2,
    },
    {
      link: "/admin/leads",
      label: "Leads",
      icon: BarChart3,
    },
    {
      link: "/admin/subscriptions",
      label: "Subscriptions",
      icon: BadgeDollarSign,
    },
    {
      link: "/admin/pending-properties",
      label: "Pending Approvals",
      icon: FileClock,
    },
    {
      link: "/admin/support",
      label: "Support",
      icon: Headset,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0
          h-screen w-72
          bg-[#020617]
          border-r border-white/10
          z-50
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">

          {/* Brand */}
          <div className="px-6 py-4 border-b border-white/10">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3 mobile-safe-top">

                <Link
                  href="/"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <ChevronLeft size={18} className="text-white" />
                </Link>

                <div>
                  <p className="text-xs text-slate-400">
                    NestMe
                  </p>

                  <h2 className="font-bold text-lg text-white">
                    Admin Panel
                  </h2>
                </div>

              </div>

              <button
                className="lg:hidden"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>

            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.link;

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3
                    px-4 py-3 rounded-xl
                    transition-all
                    ${
                      active
                        ? "bg-yellow-400 text-black shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}

          </nav>

          {/* Footer */}
          {/* <div className="p-4 border-t border-white/10">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">
                NestMe Admin
              </p>

              <p className="font-semibold">
                Control Center
              </p>
            </div>
          </div> */}

        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">

        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b mobile-safe-top border-slate-200 px-4 py-4 flex items-center justify-between">

          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <h1 className="font-bold">
            NestMe Admin
          </h1>

          <div className="w-6" />

        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}