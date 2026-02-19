import { api } from "../api";

export const propertiesApi = api.injectEndpoints({
  endpoints: (builder) => ({


    // getProperties: builder.query({
    //   query: ({ page = 1, limit = 8, ...filters }) => {
    //     const params = new URLSearchParams();

    //     // Pagination
    //     params.set("page", page.toString());
    //     params.set("limit", limit.toString());

    //     // Filters (sanitize)
    //     Object.entries(filters).forEach(([key, value]) => {
    //       if (
    //         value === undefined ||
    //         value === null ||
    //         value === "" ||
    //         (Array.isArray(value) && value.length === 0)
    //       ) {
    //         return;
    //       }

    //       // Arrays → comma-separated
    //       if (Array.isArray(value)) {
    //         params.set(key, value.join(","));
    //       } else {
    //         params.set(key, String(value));
    //       }
    //     });

    //     return `/properties?${params.toString()}`;
    //   },
    //   providesTags: (result, error, id) => [{ type: "Property", id }],
    // }),


    getProperties: builder.query({
  query: ({ page = 1, limit = 8, ...filters }) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, String(value));
      }
    });

    return `/properties?${params.toString()}`;
  },

  providesTags: (result) =>
    result?.properties
      ? [
          ...result.properties.map((p) => ({
            type: "Property",
            id: p._id,
          })),
          { type: "Property", id: "LIST" },
        ]
      : [{ type: "Property", id: "LIST" }],
}),


    getPropertyById: builder.query({
  query: (id) => `/properties/${id}`,
  providesTags: (result, error, id) => [
    { type: "Property", id },
  ],
}),


    addProperty: builder.mutation({
      query: (body) => ({
        url: "/properties",
        method: "POST",
        body,
      }),
    }),

    getSimilarProperties: builder.query({
      query: ({ city, exclude, limit = 4 }) => {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        if (exclude) params.append("exclude", exclude);
        params.append("limit", limit);
        return `/properties?${params.toString()}`;
      },
    }),

    deleteProperty: builder.mutation({
      query: (id) => ({ url: `/properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Property"],
    }),

    updatePropertyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/properties/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Property"],
    }),
    adminUpdatePropertyStatus: builder.mutation({
      query: ({ id, approvalStatus, rejectionReason }) => ({
        url: `/admin/properties/${id}/status`,
        method: "PUT",
        body: { approvalStatus, rejectionReason },
      }),
      invalidatesTags: (result, error, { id }) => [
  { type: "Property", id },
],

    }),
    
  }),
});

export const {
  useGetPropertiesQuery,
  useAddPropertyMutation,
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
  useDeletePropertyMutation,
  useUpdatePropertyMutation,
  useUpdatePropertyStatusMutation,
  useAdminUpdatePropertyStatusMutation,
} = propertiesApi;
