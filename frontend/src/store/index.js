import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice.js";
import { apiSlice } from "../services/apiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
