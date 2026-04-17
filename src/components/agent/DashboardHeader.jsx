"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
// import { useGetMeQuery } from "@/store/services/authApi";
// import { useGetNotificationsQuery } from "@/store/services/notificationApi";

export default function DashboardHeader() {
  const router = useRouter();

  // ✅ FIXED
  // const { data } = useGetMeQuery();
  // const user = data?.user;

  // const { data: notifications } = useGetNotificationsQuery();

  // const unreadCount =
  //   notifications?.filter((n) => !n.isRead)?.length || 0;

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between p-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => router.push("/")}
            className="h-10 px-4 flex items-center text-sm justify-center rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-3" />
            Go to Home
          </button>

          <h1 className="text-2xl text-end font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        

      </div>
    </div>
  );
}