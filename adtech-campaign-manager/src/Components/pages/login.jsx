import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/auth.jsx";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!login(username.trim(), password)) {
      toast.error("Invalid username or password");
      return;
    }

    toast.success("Logged in successfully");
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100 p-3 text-gray-950 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-5 shadow-lg dark:bg-slate-900 sm:max-w-md sm:space-y-5 sm:p-6"
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            AdTech Campaign Manager
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">
            Login
          </h1>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Need an account?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
