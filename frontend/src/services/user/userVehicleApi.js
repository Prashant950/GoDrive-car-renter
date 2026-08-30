import { apiSlice } from "../apiSlice.js";

export const userVehicleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (params) => ({
        url: "/vehicles",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Vehicles", id: _id })),
              { type: "Vehicles", id: "LIST" },
              "Vehicles",
            ]
          : [{ type: "Vehicles", id: "LIST" }, "Vehicles"],
    }),
    getVehicleById: builder.query({
      query: (id) => `/vehicles/${id}`,
      providesTags: (result, error, id) => [
        { type: "Vehicle", id },
        { type: "Vehicles", id },
        "Vehicles",
      ],
    }),
  }),
});

export const { useGetVehiclesQuery, useGetVehicleByIdQuery } = userVehicleApi;
