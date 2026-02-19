"use client";

import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/services/authApi";
import { useGetNotificationsQuery } from "@/store/services/notificationApi";
import BackButton from "../BackButton";

export default function DashboardHeader() {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const { data: notifications } = useGetNotificationsQuery();

  const unreadCount =
    notifications?.filter((n) => !n.isRead)?.length || 0;

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between p-4">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">

          {/* 🔙 Back Button */}
          {/* <button
            onClick={() => router.back()}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-800 transition"
          >
            <span className="material-symbols-outlined text-gray-100">
              arrow_back
            </span>
          </button> */}

          <BackButton />

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>



          {/* PROFILE */}
          {/* <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-blue-500"
                style={{
                  backgroundImage: `url(${user?.avatar || "/avatar.png"})`,
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Namaste,</p>
              <p className="font-bold">
                {user?.name || "Agent"}
              </p>
            </div>
          </div>*/}
        </div> 

        {/* RIGHT SECTION */}
        {/* <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
          <span className="material-symbols-outlined">
            notifications
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button> */}
      </div>
    </div>
  );
}
