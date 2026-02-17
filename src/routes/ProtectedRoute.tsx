import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../utils/authStorage"; 

const ProtectedRoute = () => {
  const user = authStorage.get();

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
