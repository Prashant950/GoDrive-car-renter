import { apiSlice } from "../apiSlice.js";

export const userContactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendContact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contacts", "AdminNotifications"],
    }),
  }),
});

export const { useSendContactMutation } = userContactApi;
