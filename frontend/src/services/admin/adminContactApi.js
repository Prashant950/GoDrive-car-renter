import { apiSlice } from "../apiSlice.js";

export const adminContactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => "/admin/contact",
      providesTags: ["Contacts"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/contact/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Contacts"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/admin/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} = adminContactApi;
