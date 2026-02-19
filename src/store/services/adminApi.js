import { api } from "../api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: () => "/admin/agents",
    }),
    getAllLeads: builder.query({
      query: () => "/admin/leads",
      providesTags: ["Lead"],
    }),
    getSubscriptions: builder.query({
      query: () => "/admin/subscriptions",
    }),
    getPendingProperties: builder.query({
      query: () => "/admin/pending-properties",
      providesTags: ["Properties"],
    }),
     getAdminStats: builder.query({
      query: () => "/admin/stats",
    }),
    
  }),
});

export const {
  useGetAgentsQuery,
  useGetAllLeadsQuery,
  useGetPendingPropertiesQuery,
  useGetSubscriptionsQuery,
  useGetAdminStatsQuery
} = adminApi;
