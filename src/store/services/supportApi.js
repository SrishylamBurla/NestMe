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

    getAdminSupportTickets: builder.query({
      query: () => ({
        url: "/admin/support",
        method: "GET",
      }),
      providesTags: ["AdminSupportTickets"],
    }),

    getAdminSupportTicket: builder.query({
      query: (ticketId) => ({
        url: `/admin/support/${ticketId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "AdminSupportTicket", id },
      ],
    }),

    replyAdminSupportTicket: builder.mutation({
      query: ({ ticketId, message }) => ({
        url: `/admin/support/${ticketId}/reply`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AdminSupportTicket", id: arg.ticketId },
        "AdminSupportTickets",
      ],
    }),

    assignSupportTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/admin/support/${ticketId}/assign`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AdminSupportTicket", id },
        "AdminSupportTickets",
      ],
    }),

    updateSupportStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/admin/support/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "AdminSupportTicket", id: arg.ticketId },
        "AdminSupportTickets",
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

   useGetAdminSupportTicketsQuery,
  useGetAdminSupportTicketQuery,
  useReplyAdminSupportTicketMutation,
  useAssignSupportTicketMutation,
  useUpdateSupportStatusMutation,
} = supportApi;