// import { api } from "../api";

// export const subscribeApi = api.injectEndpoints({
//   endpoints: (builder) => ({

//     // Subscribe / Upgrade
//     subscribeAgent: builder.mutation({
//       query: (plan) => ({
//         url: "/agent/subscribe",
//         method: "POST",
//         body: { plan },
//       }),
//     }),

//     // Get current subscription
//     getAgentSubscription: builder.query({
//       query: () => "/agent/subscribe",
//       providesTags: ["Subscription"],
//     }),

//     // Cancel subscription
//     cancelSubscription: builder.mutation({
//       query: () => ({
//         url: "/agent/subscribe/cancel",
//         method: "POST",
//       }),
//       invalidatesTags: ["Subscription"],
//     }),

//   }),
// });

// export const {
//   useSubscribeAgentMutation,
//   useGetAgentSubscriptionQuery,
//   useCancelSubscriptionMutation,
// } = subscribeApi;


import { api } from "../api";

export const subscribeApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Step 1: Create Razorpay Order
    createOrder: builder.mutation({
      query: (plan) => ({
        url: "/payment/create-order",
        method: "POST",
        body: { plan },
      }),
    }),

    // ✅ Step 2: Verify Payment
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/verify",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // ✅ Existing
    getAgentSubscription: builder.query({
      query: () => "/agent/subscribe",
      providesTags: ["Subscription"],
    }),

    // ✅ Cancel
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "/agent/subscribe/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetAgentSubscriptionQuery,
  useCancelSubscriptionMutation,
} = subscribeApi;