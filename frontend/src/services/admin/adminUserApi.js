import { apiSlice } from "../apiSlice.js";

export const adminUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    getUserStats: builder.query({
      query: () => "/admin/users/stats",
      providesTags: ["Stats"],
    }),
    toggleUserStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = adminUserApi;
