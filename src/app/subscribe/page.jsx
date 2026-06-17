

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetAgentSubscriptionQuery } from "@/store/services/SubscribeApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCancelSubscriptionMutation,
} from "@/store/services/SubscribeApi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function SubscribePage() {
  const router = useRouter();

  const { user, isLoading, refetch } = useAuth();
  const [loading, setLoading] = useState(false);


  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const {
    data,
    refetch: refetchSubscription

  } = useGetAgentSubscriptionQuery();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  /* ================= CANCEL ================= */



  const handleCancel = async () => {

    try {
      await cancelSubscription().unwrap();
      await refetch();
      await refetchSubscription();
      router.refresh();
      window.location.reload();
      toast.success(
        'Subscription cancelled'
      );
    } catch (err) {
      toast.error(err?.data?.message || "Cancel failed");
    }
  };

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  /* ================= ALREADY AGENT ================= */
  const sub = data?.subscription;

  const hasSubscription =
    sub?.status === 'active' &&
    new Date(sub.endDate) > new Date();

  const isAgent =
    sub?.status === 'active'
    &&
    sub?.endDate
    &&
    new Date(sub.endDate) > new Date();

  console.log("USER");
  console.log(user);

  console.log("SUB");
  console.log(sub);

  if (isAgent) {
    const sub = data?.subscription;
    const isExpired = false;

    return (
      <div className="min-h-screen mobile-safe-top bg-slate-900 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Your Agent Plan</h2>
            <p className="text-slate-400 text-sm">
              Manage your subscription
            </p>
          </div>

          {/* PLAN */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center shadow-xl">
            <p className="text-xs uppercase opacity-80">
              Current Plan
            </p>

            <p className="text-3xl font-bold capitalize">
              {sub?.plan || "Basic"}
            </p>

            <p className="text-sm opacity-90">
              ₹{sub?.price}/month
            </p>
          </div>

          {/* DETAILS */}
          <div className="space-y-3 text-sm">
            <Detail
              label="Status"
              value={isExpired ? "Expired" : "Active"}
            />

            <Detail
              label="Expiry Date"
              value={
                sub?.endDate
                  ? new Date(sub.endDate).toLocaleDateString()
                  : "—"
              }
            />

            <Detail
              label="Days Remaining"
              value={
                isExpired
                  ? "Expired"
                  : `${data?.daysRemaining ?? 0} days`
              }
            />
          </div>

          {isExpired && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="font-semibold text-red-400">
                Subscription Expired
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                Your agent benefits have been paused.
                Renew your subscription to continue
                receiving leads and accessing the
                agent dashboard.
              </p>
            </div>
          )}

          {/* ACTIONS */}
          {!isExpired && (
            <button
              onClick={() =>
                router.push(`/agents/${user.agentProfileId}/dashboard`)
              }
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold"
            >
              Go to Dashboard
            </button>
          )}

          <button
            onClick={() => router.push("/checkout?plan=basic")}
            className={`w-full py-3 rounded-xl font-semibold transition ${isExpired
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {isExpired
              ? "Renew Subscription"
              : "Upgrade Plan"}
          </button>

          {!isExpired &&
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition"
            >
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>}
        </div>
      </div>
    );
  }

  /* ================= SUBSCRIBE PAGE ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-14">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center pt-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Grow Your Real Estate Business
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              with NestMe Agent
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Join thousands of agents closing deals faster.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div className="space-y-6">
              <h2 className="text-5xl font-bold">
                ₹999
                <span className="text-lg text-slate-400">/month</span>
              </h2>

              <button
                onClick={() => router.push("/checkout?plan=basic")}
                disabled={loading}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
              >
                {loading ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
            {/* 
            <div className="space-y-4 text-sm">
              <Feature text="Unlimited listings" />
              <Feature text="Verified leads" />
              <Feature text="Analytics dashboard" />
              <Feature text="Priority approval" />
              <Feature text="Direct buyer contact" />
            </div> */}

            <div className="space-y-3 text-sm">
              <Feature text="Unlimited property listings" />
              <Feature text="Verified buyer & tenant leads" />
              <Feature text="Priority listing visibility" />
              <Feature text="Direct buyer contact access" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

// function Feature({ text }) {
//   return (
//     <div className="flex gap-3">
//       <div className="h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
//         ✓
//       </div>
//       <p className="text-slate-300">{text}</p>
//     </div>
//   );
// }

function Detail({ label, value }) {
  return (
    <div className="flex justify-between bg-white/5 rounded-lg p-3">
      <span className="text-slate-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs">
        ✓
      </div>
      <p className="text-slate-300">{text}</p>
    </div>
  );
}