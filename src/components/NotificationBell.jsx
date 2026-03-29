"use client";

import { useGetNotificationsQuery } from "@/store/services/notificationsApi";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const { data } = useGetNotificationsQuery();

  const unread = data?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
          {unread}
        </span>
      )}
    </div>
  );
}