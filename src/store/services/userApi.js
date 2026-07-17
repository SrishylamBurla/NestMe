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
      invalidatesTags: ['User']
    }),

    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['User']
    }),
   
    //For user who logged in with google can create password on mobile

    setPassword: builder.mutation({
    query: (body) => ({
        url: "/users/set-password",
        method: "PUT",
        body,
    }),
}),

  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserPropertiesQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateAvatarMutation,
  useSetPasswordMutation
} = userApi;