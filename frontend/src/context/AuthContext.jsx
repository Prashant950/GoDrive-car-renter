import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  setCredentials,
  updateUser as updateAuthUser,
  logout as logoutAction,
  selectCurrentUser,
  selectCurrentToken,
  selectIsAuthenticated,
  selectIsAdmin,
} from "../store/slices/authSlice.js";
import { useLoginMutation, useRegisterMutation, useGetMeQuery } from "../services/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  const pendingAction = useRef(null);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();

  // Validate live user status against DB on mount, on focus, and periodic polling
  const { data: meData, error: meError } = useGetMeQuery(undefined, {
    skip: !token,
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // If user was deleted from DB or deactivated
  useEffect(() => {
    if (token && meError && (meError.status === 401 || meError.status === 403)) {
      dispatch(logoutAction());
      toast.error("Your session has expired or account is no longer active.");
    }
  }, [token, meError, dispatch]);

  // Keep Redux user data in sync with DB
  useEffect(() => {
    if (meData?.user && user) {
      if (
        meData.user.name !== user.name ||
        meData.user.role !== user.role ||
        meData.user.avatar !== user.avatar
      ) {
        dispatch(updateAuthUser(meData.user));
      }
    }
  }, [meData, user, dispatch]);

  const finishAuth = useCallback(
    (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      setAuthModal({ open: false, mode: "login" });
      if (pendingAction.current) {
        const fn = pendingAction.current;
        pendingAction.current = null;
        setTimeout(() => fn(data.user), 50);
      }
    },
    [dispatch]
  );

  const login = useCallback(
    async (creds) => {
      try {
        const data = await loginMutation(creds).unwrap();
        finishAuth(data);
        toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 🎉`);
        return data.user;
      } catch (err) {
        const msg = err?.data?.message || err?.error || "Login failed. Please check credentials.";
        toast.error(msg);
        throw err;
      }
    },
    [loginMutation, finishAuth]
  );

  const register = useCallback(
    async (payload) => {
      try {
        const data = await registerMutation(payload).unwrap();
        toast.success("Account created successfully! Please log in to continue. 🎉");
        return data.user;
      } catch (err) {
        const msg = err?.data?.message || err?.error || "Registration failed";
        toast.error(msg);
        throw err;
      }
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
  }, [dispatch]);

  const updateUser = useCallback(
    (partial) => {
      if (user) {
        const merged = { ...user, ...partial };
        dispatch(updateAuthUser(merged));
      }
    },
    [dispatch, user]
  );

  const openAuth = useCallback((mode = "login", onSuccess = null) => {
    pendingAction.current = onSuccess;
    setAuthModal({ open: true, mode });
  }, []);

  const closeAuth = useCallback(() => {
    pendingAction.current = null;
    setAuthModal((m) => ({ ...m, open: false }));
  }, []);

  const setAuthMode = useCallback((mode) => setAuthModal((m) => ({ ...m, mode })), []);

  const value = {
    user,
    token,
    loading: isLoggingIn || isRegistering,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
    authModal,
    openAuth,
    closeAuth,
    setAuthMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
