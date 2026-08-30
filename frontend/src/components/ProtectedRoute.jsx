import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// Requires any logged-in user. Otherwise sends home and opens the login modal.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, openAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) openAuth("login");
  }, [isAuthenticated, openAuth]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
