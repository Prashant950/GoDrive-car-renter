import { apiSlice } from "../apiSlice.js";

export const adminNotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query({
      query: () => "/admin/notifications",
      providesTags: ["AdminNotifications"],
    }),
    markAdminNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["AdminNotifications"],
    }),
    markAllAdminNotificationsRead: builder.mutation({
      query: () => ({
        url: "/admin/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["AdminNotifications"],
    }),
    deleteAdminNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminNotifications"],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
  useDeleteAdminNotificationMutation,
} = adminNotificationApi;
