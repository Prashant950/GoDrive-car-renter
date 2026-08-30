import { apiSlice } from "../apiSlice.js";

export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useUpdateProfileMutation } = userProfileApi;
