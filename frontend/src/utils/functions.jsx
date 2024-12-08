import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export function useHandleError(error, defaultMessage = "Something went wrong") {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const handleError = (error, defaultMessage = "Something went wrong") => {
    // Check if error is an Axios error
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || defaultMessage;

      console.error("Server Error:", error.response);

      // Handle 401 status: Redirect to login
      if (status === 401) {
        toast.error("Session expired. Redirecting to login.");
        setToken(null);
        setUser(null);
        localStorage.removeItem("jwt");
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
        return;
      }

      // Handle other Axios errors
      toast.error(message);
      return;
    }

    // Non-Axios errors: log for developers and show default message
    console.error(error);
    toast.error(defaultMessage);
  };

  return handleError;
}
