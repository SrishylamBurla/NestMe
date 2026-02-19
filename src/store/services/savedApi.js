import { api } from "../api";

export const savedApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getSavedProperties: builder.query({
      query: () => "/saved",
      providesTags: ["Saved"],
    }),

    toggleSaveProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/saved/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, propertyId) => [
        { type: "Property", id: propertyId },
        "Saved",
      ],
    }),

    removeSavedProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/saved/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, propertyId) => [
        { type: "Property", id: propertyId },
        "Saved",
      ],
    }),

  }),
});

export const {
  useGetSavedPropertiesQuery,
  useToggleSavePropertyMutation,
  useRemoveSavedPropertyMutation,
} = savedApi;
