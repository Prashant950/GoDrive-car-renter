import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../store/slices/authSlice.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux auth state or localStorage fallback
    const state = getState();
    const token = state.auth?.token || localStorage.getItem("godrive_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // If token is invalid or user was deleted from DB (401 or 403)
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const url = typeof args === "object" ? args.url : args;
    const isLoginOrRegister =
      url?.includes("/auth/login") ||
      url?.includes("/auth/register") ||
      url?.includes("/auth/forgot-password") ||
      url?.includes("/auth/reset-password");

    // If it's a protected endpoint and user was deleted/unauthorized, log out immediately
    if (!isLoginOrRegister) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Vehicles",
    "Vehicle",
    "Bookings",
    "MyBookings",
    "Users",
    "Stats",
    "Notifications",
    "AdminNotifications",
    "Contacts",
    "Categories",
  ],
  endpoints: () => ({}),
});
