import { apiSlice } from "../apiSlice.js";

export const adminVehicleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createVehicle: builder.mutation({
      query: (formData) => ({
        url: "/admin/vehicles",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vehicles", { type: "Vehicles", id: "LIST" }, "Stats"],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/vehicles/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Vehicles",
        "Vehicle",
        { type: "Vehicles", id: "LIST" },
        { type: "Vehicles", id },
        { type: "Vehicle", id },
        "Stats",
      ],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/admin/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Vehicles",
        "Vehicle",
        { type: "Vehicles", id: "LIST" },
        { type: "Vehicles", id },
        "Stats",
      ],
    }),
  }),
});

export const {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = adminVehicleApi;
