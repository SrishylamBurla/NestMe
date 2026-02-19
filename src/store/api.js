import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Agent", "Property", "Admin", "User", "UserLeads", "Lead", "Notification", "Saved", "Properties", "Subscription", "Enquiries", "Leads"],
  endpoints: () => ({}),
});
