"use client";

import { useGetMeQuery } from "@/store/services/authApi";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useGetMeQuery();

  const agentId = user?.agentProfileId;

  if (!user) return null;

  const navConfig = {
    user: [
      { icon: "home", path: "/" },
      { icon: "inventory_2", path: "/my-properties" },
      { icon: "add", path: "/add-property", primary: true },
      { icon: "group", path: "/my-leads" },
      { icon: "person", path: "/me" },
    ],
    agent: [
      { icon: "home", path: "/" },
      { icon: "inventory_2", path: `/agents/${agentId}/properties` },
      { icon: "add", path: "/add-property", primary: true },
      { icon: "group", path: `/agents/${agentId}/leads` },
      { icon: "person", path: "/me" },
    ],
    admin: [
      { icon: "dashboard", path: "/admin/dashboard" },
      { icon: "home", path: "/" },
      { icon: "inventory_2", path: "/admin/properties" },
      { icon: "group", path: "/admin/users" },
      { icon: "person", path: "/me" },
    ],
  };

  const items = navConfig[user.role];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-white border border-gray-300 rounded-full px-6 py-2 flex justify-between shadow-lg">
        {items.map(({ icon, path, primary }) => {
          const active = pathname === path;

          return (
            <button
              key={icon}
              onClick={() => router.push(path)}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition
                ${
                  primary
                    ? "bg-black text-white -mt-6 shadow-lg"
                    : active
                    ? "bg-gray-100"
                    : "hover:bg-gray-100"
                }
              `}
            >
              <span
                className={`material-symbols-outlined ${
                  primary ? "text-white" : "text-gray-700"
                }`}
              >
                {icon}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
