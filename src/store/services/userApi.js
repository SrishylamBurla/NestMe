import { api } from "../api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
    }),

    getUserProperties: builder.query({
      query: (userId) => `/users/${userId}/properties`,
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-password",
        method: "PUT",
        body: data,
      }),
    }),

  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserPropertiesQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;