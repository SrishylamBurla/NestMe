import { api } from "../api";
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    getMyProperties: builder.query({
      query: () => "/auth/properties",
      providesTags: ["Property"],
    }),

    getUserLeads: builder.query({
      query: () => "/auth/leads",
      providesTags: ["UserLeads"],
    }),

    getMyEnquiries: builder.query({
      query: () => "/auth/enquiries",
      providesTags: ["Enquiries"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetMyPropertiesQuery,
  useGetUserLeadsQuery,
  useGetMyEnquiriesQuery,
} = authApi;
