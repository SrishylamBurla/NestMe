import { api } from "../api";

export const subscribeApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Subscribe / Upgrade
    subscribeAgent: builder.mutation({
      query: (plan) => ({
        url: "/agent/subscribe",
        method: "POST",
        body: { plan },
      }),
    }),

    // Get current subscription
    getAgentSubscription: builder.query({
      query: () => "/agent/subscribe",
      providesTags: ["Subscription"],
    }),

    // Cancel subscription
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
  useSubscribeAgentMutation,
  useGetAgentSubscriptionQuery,
  useCancelSubscriptionMutation,
} = subscribeApi;