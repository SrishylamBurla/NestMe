"use client";

import { useRouter } from "next/navigation";

function Row({ icon, title, link }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>
        <p className="text-sm font-medium text-white">
          {title}
        </p>
      </div>

      <span className="material-symbols-outlined text-slate-500">
        chevron_right
      </span>
    </button>
  );
}

export default function ProfileSection({ user }) {
  return (
    <div className="px-4 space-y-6">

      {/* Account */}
      <div className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden">
        <Row icon="person" title="Personal Information" link="/profile/edit" />
        <Row icon="favorite" title="Saved Properties" link="/saved" />
        {user?.role === "agent" && (
          <Row icon="home" title="My Properties" link="/agent/properties" />
        )}
      </div>

      {/* Preferences */}
      <div className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden">
        <Row icon="notifications" title="Notifications" link="/notifications" />
        <Row icon="settings" title="App Settings" link="/settings" />
      </div>

      {/* Support */}
      <div className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden">
        <Row icon="help" title="Help Center" link="/help" />
        <Row icon="description" title="Terms & Privacy" link="/terms" />
      </div>
    </div>
  );
}
