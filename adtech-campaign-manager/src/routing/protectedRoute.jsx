import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";

export function ProtectedRoute({ allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(currentUser?.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
