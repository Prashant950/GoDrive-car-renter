import { apiSlice } from "../apiSlice.js";

export const userBookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings", "MyBookings", "Stats", "Notifications", "AdminNotifications"],
    }),
    getMyBookings: builder.query({
      query: () => "/bookings/my",
      providesTags: ["MyBookings"],
    }),
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Bookings", id }],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Bookings", "MyBookings", "Stats", "AdminNotifications"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
} = userBookingApi;
