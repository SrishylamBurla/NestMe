// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useGetMeQuery } from "@/store/services/authApi";
// import { useGetAgentSubscriptionQuery } from "@/store/services/SubscribeApi";
// import { useSubscribeAgentMutation } from "@/store/services/SubscribeApi";
// import { useCancelSubscriptionMutation } from "@/store/services/SubscribeApi";
// import { toast } from "react-hot-toast";

// export default function SubscribePage() {
//   const router = useRouter();

//   const { data: user, isLoading, refetch } = useGetMeQuery();
//   const [loading, setLoading] = useState(false);
//   const { data, isLoading: isSubscriptionLoading } =
//     useGetAgentSubscriptionQuery();

//   const [cancelSubscription, { isLoading: cancelling }] =
//     useCancelSubscriptionMutation();

//   const [subscribeAgent, { isLoading: subLoading, data: subData }] =
//     useSubscribeAgentMutation();

//   const subscribeHandler = async (plan) => {
//     const loadingToast = toast.loading("Activating plan...");

//     try {
//       const data = await subscribeAgent(plan).unwrap();

//       toast.dismiss(loadingToast);
//       toast.success("Agent plan activated!");

//       router.push(`/agents/${data.agentProfileId}/dashboard`);
//     } catch (err) {
//       toast.dismiss(loadingToast);
//       toast.error(err?.data?.message || "Subscription failed");
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       await cancelSubscription().unwrap();

//       await refetch(); // 🔥 refresh user data

//       router.push("/subscribe"); // redirect to subscribe page

//       toast.success("Subscription cancelled");
//     } catch (err) {
//       toast.error(err?.data?.message || "Cancel failed");
//     }
//   };

//   /* ================= LOADING ================= */

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
//         Loading...
//       </div>
//     );
//   }

//   /* ================= ALREADY AGENT ================= */

//   if (user?.role === "agent") {
//     if (subLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
//           Loading plan...
//         </div>
//       );
//     }

//     const sub = data?.subscription;

//     return (
//       <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold">Your Agent Plan</h2>
//             <p className="text-slate-400 text-sm">Manage your subscription</p>
//           </div>

//           {/* PLAN CARD */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center shadow-xl">
//             <p className="text-xs uppercase opacity-80">Current Plan</p>

//             <p className="text-3xl font-bold capitalize">
//               {sub?.plan || "Basic"}
//             </p>

//             <p className="text-sm opacity-90">₹{sub?.price}/month</p>
//           </div>

//           {/* DETAILS */}
//           <div className="space-y-3 text-sm">
//             <Detail
//               label="Status"
//               value={data?.isActive ? "Active" : "Expired"}
//             />

//             <Detail
//               label="Expiry Date"
//               value={
//                 sub?.endDate ? new Date(sub.endDate).toLocaleDateString() : "—"
//               }
//             />

//             <Detail
//               label="Days Remaining"
//               value={`${data?.daysRemaining ?? 0} days`}
//             />
//           </div>

//           {/* ACTIONS */}
//           <button
//             onClick={() =>
//               router.push(`/agents/${user.agentProfileId}/dashboard`)
//             }
//             className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold"
//           >
//             Go to Dashboard
//           </button>

//           <button
//             onClick={() => router.push("/subscribe")}
//             className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20"
//           >
//             Upgrade / Renew Plan
//           </button>

//           <button
//             onClick={handleCancel}
//             disabled={cancelling}
//             className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition"
//           >
//             {cancelling ? "Cancelling..." : "Cancel Subscription"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ================= SUBSCRIBE PAGE ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-14 font-sans">
//       <div className="max-w-5xl mx-auto space-y-12">
//         {/* ================= HERO ================= */}

//         <div className="text-center space-y-4">
//           <h1 className="text-4xl md:text-5xl font-bold leading-tight font-sans">
//             Grow Your Real Estate Business
//             <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
//               with NestMe Agent
//             </span>
//           </h1>

//           <p className="text-slate-400 max-w-2xl mx-auto">
//             Join thousands of professional agents who trust NestMe to generate
//             high-quality leads and close deals faster.
//           </p>
//         </div>

//         {/* ================= PRICING CARD ================= */}

//         <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12">
//           <div className="grid md:grid-cols-2 gap-10 items-center">
//             {/* LEFT — PRICE */}

//             <div className="text-center md:text-left space-y-6">
//               <div>
//                 <p className="text-sm text-indigo-400 uppercase font-semibold tracking-wide">
//                   Basic Plan
//                 </p>

//                 <h2 className="text-5xl font-bold mt-2">
//                   ₹999
//                   <span className="text-lg text-slate-400 font-medium">
//                     /month
//                   </span>
//                 </h2>
//               </div>

//               <button
//                 onClick={() => subscribeHandler("basic")}
//                 disabled={loading}
//                 className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-xl hover:scale-[1.02] transition"
//               >
//                 {loading ? "Processing..." : "Subscribe Now"}
//               </button>

//               <p className="text-xs text-slate-500">
//                 Cancel anytime • No hidden charges
//               </p>
//             </div>

//             {/* RIGHT — FEATURES */}

//             <div className="space-y-4 text-sm">
//               <Feature text="Unlimited property listings" />
//               <Feature text="Receive verified buyer & tenant leads" />
//               <Feature text="Advanced analytics dashboard" />
//               <Feature text="Priority property approval" />
//               <Feature text="Direct contact with serious buyers" />
//               <Feature text="Professional agent profile page" />
//             </div>
//           </div>
//         </div>

//         {/* ================= TRUST / SOCIAL PROOF ================= */}

//         <div className="grid grid-cols-3 gap-6 text-center text-sm">
//           <Stat value="10K+" label="Active Buyers" />
//           <Stat value="120+" label="Cities Covered" />
//           <Stat value="95%" label="Verified Users" />
//         </div>

//         {/* ================= BACK BUTTON ================= */}

//         <div className="text-center">
//           <button
//             onClick={() => router.back()}
//             className="text-slate-400 hover:text-white transition text-sm"
//           >
//             ← Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= FEATURE ================= */

// function Feature({ text }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
//         ✓
//       </div>
//       <p className="text-slate-300">{text}</p>
//     </div>
//   );
// }

// /* ================= STATS ================= */

// function Stat({ value, label }) {
//   return (
//     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
//       <p className="text-2xl font-bold text-indigo-400">{value}</p>
//       <p className="text-slate-400 text-xs mt-1">{label}</p>
//     </div>
//   );
// }

// /* ================= DETAILS ROW ================= */

// function Detail({ label, value }) {
//   return (
//     <div className="flex justify-between bg-white/5 border border-white/10 rounded-lg p-3">
//       <span className="text-slate-400">{label}</span>
//       <span className="font-semibold">{value}</span>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetMeQuery } from "@/store/services/authApi";
import { useGetAgentSubscriptionQuery } from "@/store/services/SubscribeApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCancelSubscriptionMutation,
} from "@/store/services/SubscribeApi";
import { toast } from "react-hot-toast";

export default function SubscribePage() {
  const router = useRouter();

  const { data: user, isLoading, refetch } = useGetMeQuery();
  const [loading, setLoading] = useState(false);

  const { data } = useGetAgentSubscriptionQuery();

  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  /* ================= SUBSCRIBE HANDLER ================= */

  // const subscribeHandler = async (plan) => {
  //   const loadingToast = toast.loading("Initializing payment...");

  //   try {
  //     setLoading(true);

  //     // 1️⃣ Create order
  //     const order = await createOrder(plan).unwrap();

  //     toast.dismiss(loadingToast);

  //     if (!window.Razorpay) {
  //       toast.error("Razorpay SDK not loaded");
  //       return;
  //     }

  //     // 2️⃣ Razorpay checkout
  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //       amount: order.amount,
  //       currency: "INR",
  //       order_id: order.id,

  //       name: "NestMe",
  //       description: "Agent Subscription",

  //       handler: async function (response) {
  //         const verifyToast = toast.loading("Verifying payment...");

  //         try {
  //           const result = await verifyPayment({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //           }).unwrap();

  //           toast.dismiss(verifyToast);

  //           if (result.success) {
  //             toast.success("🎉 Subscription activated!");

  //             await refetch();

  //             router.push(
  //               `/agents/${result.agentProfileId}/dashboard`
  //             );
  //           } else {
  //             toast.error("Payment verification failed");
  //           }
  //         } catch (err) {
  //           toast.dismiss(verifyToast);
  //           toast.error(err?.data?.message || "Verification failed");
  //         }
  //       },

  //       modal: {
  //         ondismiss: () => {
  //           toast.error("Payment cancelled");
  //         },
  //       },

  //       prefill: {
  //         name: user?.name || "",
  //         email: user?.email || "",
  //       },

  //       theme: {
  //         color: "#6366f1",
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (err) {
  //     toast.dismiss(loadingToast);
  //     toast.error(err?.data?.message || "Payment failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /* ================= CANCEL ================= */

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();

      await refetch();

      router.push("/subscribe");

      toast.success("Subscription cancelled");
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

  if (user?.role === "agent") {
    const sub = data?.subscription;

    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
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
              value={data?.isActive ? "Active" : "Expired"}
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
              value={`${data?.daysRemaining ?? 0} days`}
            />
          </div>

          {/* ACTIONS */}
          <button
            onClick={() =>
              router.push(`/agents/${user.agentProfileId}/dashboard`)
            }
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/subscribe")}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20"
          >
            Upgrade / Renew Plan
          </button>

          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition"
          >
            {cancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      </div>
    );
  }

  /* ================= SUBSCRIBE PAGE ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-14">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center space-y-4">
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