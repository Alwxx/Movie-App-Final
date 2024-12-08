import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "./UI/Spinner";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center dark:bg-gray-800 bg-gray-200">
        <Spinner />;
      </div>
    );
  }

  if (!user) {
    toast("Please login first");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
