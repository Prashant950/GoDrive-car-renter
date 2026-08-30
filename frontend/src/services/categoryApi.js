import { apiSlice } from "./apiSlice.js";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories", "Vehicles"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories", "Vehicles"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
