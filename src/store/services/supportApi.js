import { apiSlice } from "./apiSlice";

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Get My Tickets
    // ===========================
    getSupportTickets: builder.query({
      query: () => ({
        url: "/support",
        method: "GET",
      }),
      providesTags: ["SupportTickets"],
    }),

    // ===========================
    // Get Single Ticket
    // ===========================
    getSupportTicket: builder.query({
      query: (id) => ({
        url: `/support/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "SupportTicket", id },
      ],
    }),

    // ===========================
    // Create Ticket
    // ===========================
    createSupportTicket: builder.mutation({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    // ===========================
    // Send User Message
    // ===========================
    sendSupportMessage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/support/${id}/message`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SupportTickets",
        { type: "SupportTicket", id },
      ],
    }),

    // ===========================
    // Admin Reply
    // ===========================
    replySupportTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/support/${id}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SupportTickets",
        { type: "SupportTicket", id },
      ],
    }),

    // ===========================
    // Mark Read
    // ===========================
    markSupportRead: builder.mutation({
      query: (id) => ({
        url: `/support/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "SupportTickets",
        { type: "SupportTicket", id },
      ],
    }),

    // ===========================
    // Close Ticket
    // ===========================
    closeSupportTicket: builder.mutation({
      query: (id) => ({
        url: `/support/${id}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "SupportTickets",
        { type: "SupportTicket", id },
      ],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketQuery,

  useCreateSupportTicketMutation,

  useSendSupportMessageMutation,

  useReplySupportTicketMutation,

  useMarkSupportReadMutation,

  useCloseSupportTicketMutation,
} = supportApi;