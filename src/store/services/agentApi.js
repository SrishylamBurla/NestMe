import { api } from "../api";

export const agentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAgentById: builder.query({
      query: (id) => `agents/${id}`,
      transformResponse: (res) => res.agent,
    }),

    getAgentProperties: builder.query({
      query: (agentId) => `agents/${agentId}/properties`,
      providesTags: ["Property"],
    }),

    getAgentLeads: builder.query({
      query: (agentId) => `agents/${agentId}/leads`,
      providesTags: ["Lead"],
    }),

    getAgentStats: builder.query({
      query: (agentId) => `agents/${agentId}/stats`,
    }),

    getAgentAppointments: builder.query({
  query: (agentId) => `/agents/${agentId}/appointments`,
}),
getAgentEnquiries: builder.query({
  query: (agentId) => `/agents/${agentId}/enquiries`,   


  }),
})
});

export const {
  useGetAgentByIdQuery,
  useGetAgentPropertiesQuery,
  useGetAgentLeadsQuery,
  useGetAgentStatsQuery,
  useGetAgentAppointmentsQuery,
  useGetAgentEnquiriesQuery,
} = agentApi;
