import { api } from "../api";

export const subscribeApi = api.injectEndpoints({
  endpoints: (builder) => ({


    subscribe: builder.mutation({
      query: (body) => ({
        url: "/newsletter",
        method: "POST",
        body,
      }),
    }),

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

    createStripeSession: builder.mutation({
      query: (plan) => ({
        url: "/payment/stripe/create",
        method: "POST",
        body: { plan }
      })
    }),

    verifyStripe: builder.mutation({
      query: (sessionId) => ({
        url: '/payment/stripe/verify',
        method: 'POST',
        body: {
          sessionId
        }
      }),
      invalidatesTags: ['Subscription']
    }),

  }),
});

export const {
  useSubscribeMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetAgentSubscriptionQuery,
  useCancelSubscriptionMutation,
  useCreateStripeSessionMutation,
  useVerifyStripeMutation
} = subscribeApi;