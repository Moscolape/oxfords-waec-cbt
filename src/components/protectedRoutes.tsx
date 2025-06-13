import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const allowedRoutesPerRole: Record<string, string[]> = {
  student: [
    "/take-test",
    "/take-test/mathematics",
    "/take-test/english",
    "/take-test/physics",
    "/take-test/chemistry",
    "/take-test/biology",
    "/take-test/government",
    "/take-test/crs",
    "/take-test/literature",
    "/take-test/civic",
    "/take-test/economics",
    "/take-test/fishery",
    "/take-test/fmaths",
  ],
  staff: ["/scores"],
  admin: ["/panel", "/questions"],
  principal: ["/panel", "/scores", "/passwords"],
};

const ProtectedRoute = () => {
  const { token, userrole } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!userrole || !(userrole in allowedRoutesPerRole)) {
    return <Navigate to="/" replace />;
  }

  const allowedRoutes = allowedRoutesPerRole[userrole];
  const currentPath = location.pathname;

  const isAllowed = allowedRoutes.some((path) =>
    currentPath.startsWith(path)
  );

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;