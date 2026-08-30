import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// Requires an admin. Non-admins go to their dashboard; guests get the login modal.
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, openAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) openAuth("login");
  }, [isAuthenticated, openAuth]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
