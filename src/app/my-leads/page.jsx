"use client"
import { useRouter } from "next/navigation";
import UserLeadsClient from "./UserLeadsClient";

export default function MyLeadsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-4">

        <div className="mb-4 flex items-center gap-4">
        <button
      onClick={() => router.back()}
      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shadow-sm"
    >
      <span className="material-symbols-outlined text-slate-700">
        arrow_back
      </span>
    </button>
          
          <h1 className="text-2xl font-sans font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Leads on My Properties
          </h1>
        </div>

        <UserLeadsClient />
      </div>
    </div>
  );
}
