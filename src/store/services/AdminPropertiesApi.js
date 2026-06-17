import { api } from "../api";

export const adminPropertiesApi =
  api.injectEndpoints({

    endpoints: (builder) => ({

      getAdminProperties:
        builder.query({

          query: () =>
            "/admin/properties",

          providesTags: [
            "Property",
          ],
      }),

      // getAdminStats:
      //   builder.query({

      //     query: () =>
      //       "/admin/stats",
      // }),

    }),
});

export const {
  useGetAdminPropertiesQuery,
  // useGetAdminStatsQuery,
} = adminPropertiesApi;