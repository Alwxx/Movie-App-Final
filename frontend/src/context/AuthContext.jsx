import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import prop-types
import { getUser } from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserFn = async (token) => {
      setIsLoading(true);
      try {
        const response = await getUser(token);
        setUser(response);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // JWT expired or unauthorized
          localStorage.removeItem("token");
          setToken(null);
          toast.error("Your session has expired. Please log in again.");
        } else {
          console.error("Error fetching user profile:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("jwt") && !user) {
      setToken(localStorage.getItem("jwt"));
      //Get user from server:
      getUserFn(localStorage.getItem("jwt"));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
