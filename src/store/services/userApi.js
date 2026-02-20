import { api } from "../api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
    }),

    getUserProperties: builder.query({
      query: (userId) => `/users/${userId}/properties`,
    }),

  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserPropertiesQuery,
} = userApi;