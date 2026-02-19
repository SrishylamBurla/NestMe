import { api } from "../api";

export const adminPropertiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProperties: builder.query({
      query: () => "/admin/properties",
      providesTags: ["Property"],
    }),
    getAdminStatsQuery: builder.query
    
  }),
});

export const {
  useGetAdminPropertiesQuery,
  
} = adminPropertiesApi;
