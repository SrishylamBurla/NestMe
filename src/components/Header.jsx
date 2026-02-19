"use client";

import { useGetMeQuery, useLogoutMutation } from "@/store/services/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
} from "@/store/services/notificationApi";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });

  const [markRead] = useMarkReadMutation();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    setOpenDrawer(false);
    setShowNotifications(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  /* ================= GROUP NOTIFICATIONS ================= */

  const groupedNotifications = useMemo(() => {
    if (!notifications) return {};

    const groups = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    notifications.forEach((n) => {
      const created = new Date(n.createdAt);

      if (created.toDateString() === today.toDateString()) groups.Today.push(n);
      else if (created.toDateString() === yesterday.toDateString())
        groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });

    return groups;
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case "property-approved":
        return "check_circle";
      case "property-rejected":
        return "cancel";
      case "lead-received":
        return "mail";
      case "property-created":
        return "hourglass_top";
      default:
        return "notifications";
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* LEFT PROFILE */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (!isMobile && user) {
              setOpenDrawer(true);
            }
          }}
        >
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="font-bold text-indigo-600 text-lg">
              {user?.name?.[0] || "G"}
            </span>
          </div>

          <div>
            <p className="text-xs text-gray-400">Welcome</p>
            <h1 className="text-sm font-semibold capitalize">
              {user?.name || "Guest"}
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <FavoriteButton />
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <span className="material-symbols-outlined text-gray-700">
                  notifications
                </span>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          )}

          {!user && !isLoading && (
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* ================= DRAWER OVERLAY ================= */}
      {!isMobile && openDrawer && (
        <div
          onClick={() => setOpenDrawer(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />
      )}

      {/* ================= LEFT SLIDING DRAWER ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-50 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
          ${openDrawer ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* USER INFO */}
        <div className="p-3 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="font-bold text-indigo-600 text-lg">
              {user?.name?.[0]}
            </span>
          </div>
          <div>
            <p className="font-semibold capitalize">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <DrawerItem label="My Profile" onClick={() => router.push("/me")} />

          {user?.role === "user" && (
            <>
              <DrawerItem
                label="Add Property"
                onClick={() => router.push("/add-property")}
              />
              <DrawerItem
                label="My Properties"
                onClick={() => router.push("/my-properties")}
              />
              <DrawerItem
                label="My Leads"
                onClick={() => router.push("/my-leads")}
              />
              <DrawerItem
                label="My Enquiries"
                onClick={() => router.push("/my-enquiries")}
              />
              <DrawerItem
                label="Become Agent"
                onClick={() => router.push("/subscribe")}
              />
            </>
          )}

          {user?.role === "agent" && (
            <>
              <DrawerItem
                label="Dashboard"
                onClick={() =>
                  router.push(`/agents/${user.agentProfileId}/dashboard`)
                }
              />
              <DrawerItem
                label="My Listings"
                onClick={() =>
                  router.push(`/agents/${user.agentProfileId}/properties`)
                }
              />
              <DrawerItem
                label="Leads"
                onClick={() =>
                  router.push(`/agents/${user.agentProfileId}/leads`)
                }
              />
              <DrawerItem
                label="Add Property"
                onClick={() => router.push("/add-property")}
              />
            </>
          )}

          {user?.role === "admin" && (
            <>
              <DrawerItem
                label="Dashboard"
                onClick={() => router.push("/admin/dashboard")}
              />
              <DrawerItem
                label="Users"
                onClick={() => router.push("/admin/users")}
              />
              <DrawerItem
                label="Properties"
                onClick={() => router.push("/admin/properties")}
              />
              <DrawerItem
                label="Agents"
                onClick={() => router.push("/admin/agents")}
              />
            </>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= NOTIFICATION OVERLAY ================= */}
      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />
      )}

      {/* ================= RIGHT NOTIFICATION PANEL ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
          ${showNotifications ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => setShowNotifications(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedNotifications).map(
            ([group, items]) =>
              items.length > 0 && (
                <div key={group}>
                  <p className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase">
                    {group}
                  </p>

                  {items.map((n) => (
                    <div
                      key={n._id}
                      onClick={async () => {
                        await markRead(n._id);
                        setShowNotifications(false);
                        router.push(n.link);
                      }}
                      className={`flex gap-3 px-5 py-4 border-b cursor-pointer transition
                        ${
                          !n.isRead
                            ? "bg-indigo-50 hover:bg-indigo-100"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <span className="material-symbols-outlined text-indigo-500 mt-1">
                        {getIcon(n.type)}
                      </span>

                      <div className="flex-1">
                        <p className="text-sm font-semibold">{n.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-2">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!n.isRead && (
                        <span className="h-2 w-2 bg-indigo-600 rounded-full mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              ),
          )}
        </div>
      </div>
    </>
  );
}

/* ================= SMALL COMPONENT ================= */

function DrawerItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}

import { useGetSavedPropertiesQuery } from "@/store/services/savedApi";

function FavoriteButton() {
  const router = useRouter();
  const { data } = useGetSavedPropertiesQuery();

  const count = data?.saved?.length || 0;

  return (
    <button
      onClick={() => router.push("/saved")}
      className="relative p-2 rounded-full hover:bg-gray-100 transition"
    >
      <span className="material-symbols-outlined text-gray-700">favorite</span>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-1.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
