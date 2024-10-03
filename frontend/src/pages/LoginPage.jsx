import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AuthContext from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const { setToken, isLoading, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("jwt", data.token);
      setToken(data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password.");
    }
  };

  useEffect(() => {
    if (user) {
      //Already logged in
      navigate("/");
    }
  }, [user]);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-gray-800 transition-all">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="CineHub"
            src="https://i.postimg.cc/P5YSJ0qs/Untitled-2.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-white text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 flex bg-gray-100 items-center gap-2 px-2">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block bg-gray-100 px-2 w-full rounded-md border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
                <div onClick={(e) => setShowPass((prev) => !prev)}>
                  {showPass ? (
                    <EyeSlashIcon className="size-6 text-red-500 cursor-pointer" />
                  ) : (
                    <EyeIcon className="size-6 text-red-500 cursor-pointer" />
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account yet ?{" "}
            <Link
              to="/sign-up"
              className="font-semibold leading-6 text-red-600 hover:text-red-500"
            >
              Sign up instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
