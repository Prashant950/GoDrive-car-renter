import { apiSlice } from "../apiSlice.js";

export const adminBookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: (params) => ({
        url: "/admin/bookings",
        params,
      }),
      providesTags: ["Bookings"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/bookings/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Bookings", "MyBookings", "Stats", "Notifications"],
    }),
  }),
});

export const { useGetAllBookingsQuery, useUpdateBookingStatusMutation } = adminBookingApi;
