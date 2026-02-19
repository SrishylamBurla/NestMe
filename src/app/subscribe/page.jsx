"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetMeQuery } from "@/store/services/authApi";

export default function SubscribePage() {
  const router = useRouter();
  const { data: user, isLoading } = useGetMeQuery();
  const [loading, setLoading] = useState(false);

  const subscribeHandler = async (plan) => {
    try {
      setLoading(true);

      const res = await fetch("/api/agent/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      router.push(`/agents/${data.agentProfileId}/dashboard`);
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (user?.role === "agent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="bg-slate-800 border border-white/10 p-8 rounded-2xl text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-bold">You're already an Agent 🎯</h2>
          <button
            onClick={() =>
              router.push(`/agents/${user.agentProfileId}/dashboard`)
            }
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-full font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center px-4 py-10">

      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Become a Professional Agent
          </h1>
          <p className="text-sm text-slate-400">
            Unlock powerful tools to grow your real estate business.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center shadow-xl">
          <p className="text-4xl font-bold">₹999</p>
          <p className="text-sm opacity-90">Per Month</p>
        </div>

        {/* Features */}
        <div className="space-y-3 text-sm text-slate-300">
          <Feature text="Post Unlimited Properties" />
          <Feature text="Receive Verified Buyer Leads" />
          <Feature text="Track Property Views" />
          <Feature text="Lead Analytics & Growth Dashboard" />
          <Feature text="Priority Property Approval" />
        </div>

        {/* CTA */}
        <button
          onClick={() => subscribeHandler("basic")}
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg"
        >
          {loading ? "Processing..." : "Subscribe & Start Selling 🚀"}
        </button>

        {/* Back Home */}
        <button
          onClick={() => router.push("/")}
          className="w-full text-xs text-slate-400 hover:text-white transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

/* ================= FEATURE ITEM ================= */

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
        ✓
      </div>
      <p>{text}</p>
    </div>
  );
}
