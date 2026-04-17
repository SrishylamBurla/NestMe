"use client";

import { useRouter } from "next/navigation";

export default function ProfileHeader({ user }) {
  const router = useRouter();

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-4 flex justify-between items-center">

        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            arrow_back
          </span>
        </button>

        <h2 className="text-xl font-bold">Account</h2>

        <button
          onClick={() => router.push("/me/edit")}
          className="h-10 w-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            edit
          </span>
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-6 pb-8 gap-2">

        <div className="relative">
          <div className="p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          {user?.role === "agent" && (
            <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1 shadow">
              <span className="material-symbols-outlined text-sm">
                verified
              </span>
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold">{user?.name}</h1>
        <p className="text-sm text-slate-400">{user?.email}</p>

        <span className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 capitalize">
          {user?.role}
        </span>
      </div>
    </>
  );
}