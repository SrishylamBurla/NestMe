import { api } from "../api"

export const enquiryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEnquiry: builder.mutation({
      query: (data) => ({
        url: "/enquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enquiry"],
    }),
    // getMyEnquiries: builder.query({
    //   query: () => "/enquiries/my",
    //   providesTags: ["Enquiry"],
    // }),
  }),
});

export const {
  useCreateEnquiryMutation,
  // useGetMyEnquiriesQuery,
} = enquiryApi;
