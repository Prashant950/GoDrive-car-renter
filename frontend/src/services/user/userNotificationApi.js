import { apiSlice } from "../apiSlice.js";

export const userNotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = userNotificationApi;
