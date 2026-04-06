import { api } from "../api";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),

    markRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),

      savePushToken: builder.mutation({
  query: (token) => ({
    url: "/notifications/save-token",
    method: "POST",
    body: { token },
  }),
}),

      // ⚡ Optimistic UI
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              const notif = draft.find((n) => n._id === id);
              if (notif) notif.isRead = true;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useSavePushTokenMutation,
} = notificationApi;