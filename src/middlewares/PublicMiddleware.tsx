import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../stores/authStore";
export default function PublicMiddleware() {
  const token = useAuth((state) => state.token);
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
