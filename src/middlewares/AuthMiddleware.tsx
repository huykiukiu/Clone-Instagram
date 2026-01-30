import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/authStore";
export default function AuthMiddleware() {
  const token = useAuth((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
