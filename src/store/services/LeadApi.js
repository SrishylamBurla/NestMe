import { api } from "../api";

export const leadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (data) => ({
        url: "/leads/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, body) => [
  { type: "Property", id: body.propertyId },
],
    }),
    getMyLeads: builder.query({
      query: () => "/leads/my",
    }),

    updateLeadStatus: builder.mutation({
      query: ({ leadId, status }) => ({
        url: `/leads/${leadId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["UserLeads", "Lead"],
    }),
    createAgentLead: builder.mutation({
  query: ({ agentId, ...body }) => ({
    url: `/agents/${agentId}/leads`,
    method: "POST",
    body,
  }),
  invalidatesTags: ["Lead", "Property"],
}),

  }),
});

export const {
  useCreateLeadMutation,
  useGetMyLeadsQuery,
  useCreateAgentLeadMutation,
  // useGetAgentLeadsQuery,
  // useGetAllLeadsQuery,
  useUpdateLeadStatusMutation,
} = leadApi;
