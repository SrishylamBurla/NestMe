"use client";

import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCreateStripeSessionMutation,
} from "@/store/services/SubscribeApi";

import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const plan = params.get("plan");

  const { user, refetch } = useAuth();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const [createStripeSession] = useCreateStripeSessionMutation();



  const [gateway, setGateway] = useState('razorpay');
  const [country, setCountry] = useState(null);
  const [detecting, setDetecting] = useState(true);

  // const country=Intl.DateTimeFormat() .resolvedOptions() .locale;

  const priceMap = {
    basic: 999,
  };

  const price = priceMap[plan];
useEffect(() => {
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      if (data.country_code === "IN") {
        setCountry("IN");
        setGateway("razorpay");
      } else {
        setCountry("INT");
        setGateway("stripe");
      }

      // IMPORTANT
      setDetecting(false);
    })
    .catch(() => {
      // fallback
      setCountry("IN");
      setGateway("razorpay");
      setDetecting(false);
    });
}, []);

  const handleRazorpayPayment = async () => {
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

  const handleStripePayment = async () => {
    try {
      const res = await createStripeSession(
        plan
      ).unwrap();
      window.location.href = res.url;
    }
    catch {
      toast.error(
        'Stripe payment failed'
      );
    }
  };

  const handlePayment = () => {
    if (gateway === 'razorpay') {
      handleRazorpayPayment();
    }
    else {
      handleStripePayment();
    }
  }

  if (detecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">
          Detecting payment methods...
        </div>
      </div>
    );

  }
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Invalid Plan
      </div>
    );
  }

  return (


    <div className="min-h-screen mobile-safe-top bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">

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

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={() => setGateway('razorpay')}

              className={`p-4 rounded-xl border
${gateway === 'razorpay'
                  ?
                  'border-indigo-500 bg-indigo-500/20'
                  :
                  'border-white/10'
                }
`}
            >
              🇮🇳 Razorpay
            </button>
            <button
              onClick={() => setGateway(
                'stripe'
              )}
              className={`p-4 rounded-xl border
${gateway === 'stripe' ?
                  'border-indigo-500 bg-indigo-500/20'
                  :
                  'border-white/10'
                }
`}
            >
              🌍 Stripe
            </button>
          </div>

          <div className="text-center">
            {
              country === 'IN'
                ?
                (
                  <p className="text-green-400">
                    ✓ Recommended for your region
                  </p>
                )
                :
                (
                  <p className="text-sky-400">
                    ✓ Recommended for your region
                  </p>
                )}
          </div>

          {/* CTA */}
          <button
            onClick={handlePayment}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-xl"
          >
            {gateway === 'stripe' ? 'Pay with Stripe' : 'Pay with Razorpay'}
          </button>

          {/* TRUST */}
          <div className="text-center text-xs text-slate-400 space-y-1">
            <p>🔒 100% Secure Payments</p>
            <p>Powered by {gateway === 'stripe' ? 'Stripe' : 'Razorpay'
            }</p>

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