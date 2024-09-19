import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Signuppage.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    try {
      const response = await api.post("/users/signup", {
        username,
        email,
        password,
      });
      window.alert("Registration successful! Please log in.", response);
      setSuccess("Registration successful! Please log in.");
      setError("");
      navigate("/login");
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
