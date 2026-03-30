"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/services/SubscribeApi";
import { useGetMeQuery } from "@/store/services/authApi";
import { toast } from "react-hot-toast";

export default function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const plan = params.get("plan");

  const { data: user, refetch } = useGetMeQuery();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const priceMap = {
    basic: 999,
  };

  const price = priceMap[plan];

  const handlePayment = async () => {
    const loading = toast.loading("Preparing payment...");

    try {
      const order = await createOrder(plan).unwrap();

      toast.dismiss(loading);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "NestMe",
        description: `${plan} Plan Subscription`,

        handler: async function (response) {
          const verifyToast = toast.loading("Verifying...");

          try {
            const res = await verifyPayment(response).unwrap();

            toast.dismiss(verifyToast);

            if (res.success) {
              toast.success("Payment Successful!");
              await refetch();
              router.push(`/agents/${res.agentProfileId}/dashboard`);
            }
          } catch {
            toast.dismiss(verifyToast);
            toast.error("Verification failed");
          }
        },

        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      toast.dismiss(loading);
      toast.error("Payment failed");
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Invalid Plan
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-white flex items-center justify-center px-4">
    //   <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">

    //     <h2 className="text-2xl font-bold text-center">Checkout</h2>

    //     <div className="bg-indigo-600 rounded-2xl p-6 text-center">
    //       <p className="text-sm uppercase opacity-80">Plan</p>
    //       <p className="text-3xl font-bold capitalize">{plan}</p>
    //       <p className="text-lg mt-2">₹{price}</p>
    //     </div>

    //     <button
    //       onClick={handlePayment}
    //       className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
    //     >
    //       Pay ₹{price}
    //     </button>

    //     <button
    //       onClick={() => router.back()}
    //       className="w-full py-2 text-sm text-slate-400"
    //     >
    //       ← Back
    //     </button>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">

  <div className="max-w-md w-full space-y-6">

    {/* HEADER */}
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold">Secure Checkout</h1>
      <p className="text-sm text-slate-400">
        Complete your subscription in seconds
      </p>
    </div>

    {/* CARD */}
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">

      {/* PLAN */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-center relative overflow-hidden">

        {/* Glow */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

        <div className="relative space-y-2">
          <p className="text-xs uppercase tracking-widest opacity-80">
            NestMe Agent Plan
          </p>

          <h2 className="text-4xl font-bold">₹{price}</h2>

          <p className="text-sm opacity-80">
            Billed monthly • Cancel anytime
          </p>
        </div>
      </div>

      {/* FEATURES */}
      {/* <div className="space-y-3 text-sm">
        <Feature text="Unlimited property listings" />
        <Feature text="Verified buyer & tenant leads" />
        <Feature text="Priority listing visibility" />
        <Feature text="Direct buyer contact access" />
      </div> */}

      {/* DIVIDER */}
      <div className="border-t border-white/10" />

      {/* TOTAL */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Total</span>
        <span className="text-lg font-semibold">₹{price}</span>
      </div>

      {/* CTA */}
      <button
        onClick={handlePayment}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-xl"
      >
        Pay ₹{price}
      </button>

      {/* TRUST */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p>🔒 100% Secure Payments</p>
        <p>Powered by Razorpay</p>
      </div>

    </div>

    {/* BACK */}
    <button
      onClick={() => router.back()}
      className="w-full text-sm text-slate-400 hover:text-white transition"
    >
      ← Back
    </button>

  </div>
</div>
  );
}

// function Feature({ text }) {
//   return (
//     <div className="flex gap-3 items-center">
//       <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs">
//         ✓
//       </div>
//       <p className="text-slate-300">{text}</p>
//     </div>
//   );
// }