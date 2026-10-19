//route guard that wraps admin pages
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAdmin({children}) {
  const { user, checking} = useAuth();
  const location =useLocation();

  if (checking) return <p>checking...</p>;
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname}} replace />;    
  }
  if (user.role !== "admin") {
    return <p>You dont have access to this page.</p>;    
  }
  return children;  
}
export default RequireAdmin;