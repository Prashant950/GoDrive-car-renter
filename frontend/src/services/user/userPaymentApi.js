import { apiSlice } from "../apiSlice.js";

export const userPaymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRazorpayKey: builder.query({
      query: () => "/payments/key",
    }),
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: "/payments/create-order",
        method: "POST",
        body: data,
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: "/payments/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings", "MyBookings", "Stats", "Notifications", "AdminNotifications"],
    }),
    payRegistration: builder.mutation({
      query: (data) => ({
        url: "/payments/registration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings", "MyBookings", "Stats", "Notifications", "AdminNotifications"],
    }),
  }),
});

export const {
  useGetRazorpayKeyQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  usePayRegistrationMutation,
} = userPaymentApi;
