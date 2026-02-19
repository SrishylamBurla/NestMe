"use client";

import { useRouter } from "next/navigation";

export default function ProfileHeader({ user }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4 flex justify-between items-center">
        
        <button
          onClick={handleBack}
          className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          My Profile
        </h2>

        <button
          onClick={() => router.push("/profile/edit")}
          className="h-10 w-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition"
        >
          <span className="material-symbols-outlined text-white">
            edit
          </span>
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-3 pt-6 pb-8">
        <div className="relative">
          <div className="p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          {user?.role === "agent" && (
            <div className="absolute bottom-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow">
              <span className="material-symbols-outlined text-sm">
                verified
              </span>
            </div>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {user?.name}
        </h1>

        <p className="text-sm text-slate-400">{user?.email}</p>

        <span className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 capitalize">
          {user?.role}
        </span>
      </div>
    </>
  );
}
