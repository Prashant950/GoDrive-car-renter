import { createSlice } from "@reduxjs/toolkit";

const getSavedAuth = () => {
  try {
    const token = localStorage.getItem("godrive_token") || null;
    const userStr = localStorage.getItem("godrive_user");
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin: Boolean(user?.role === "admin"),
    };
  } catch {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }
};

const initialState = getSavedAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(token && user);
      state.isAdmin = Boolean(user?.role === "admin");

      if (token) {
        localStorage.setItem("godrive_token", token);
        console.log("Logged In User Token:", token);
      }
      if (user) {
        localStorage.setItem("godrive_user", JSON.stringify(user));
      }
    },
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      state.user = updatedUser;
      state.isAdmin = Boolean(updatedUser?.role === "admin");
      localStorage.setItem("godrive_user", JSON.stringify(updatedUser));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem("godrive_token");
      localStorage.removeItem("godrive_user");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;
