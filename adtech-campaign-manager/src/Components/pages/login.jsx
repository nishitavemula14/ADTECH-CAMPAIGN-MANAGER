import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/useAuth.js";

export default function Login() {
  const { currentUser, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const inputClassName =
    "w-full rounded-md border bg-white p-3 text-gray-900 focus:outline-none dark:bg-slate-950 dark:text-slate-100";

  function getInputClassName(fieldName) {
    return errors[fieldName]
      ? `${inputClassName} border-red-500 focus:border-red-500 dark:border-red-500`
      : `${inputClassName} border-gray-300 focus:border-blue-500 dark:border-slate-700`;
  }

  function updateUsername(value) {
    setUsername(value);
    setErrors((currentErrors) => ({ ...currentErrors, username: "" }));
  }

  function updatePassword(value) {
    setPassword(value);
    setErrors((currentErrors) => ({ ...currentErrors, password: "" }));
  }

  function getRoleRedirect(role) {
    return ["admin", "superadmin"].includes(role) ? "/admin" : "/";
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleRedirect(currentUser?.role)} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};

    if (username.trim() === "") {
      nextErrors.username = "Username is required";
    }

    if (password === "") {
      nextErrors.password = "Password is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = login(username.trim(), password);

    if (!result.ok) {
      setErrors({ password: "Invalid username or password" });
      return;
    }

    toast.success("Logged in successfully");
    navigate(getRoleRedirect(result.user.role), { replace: true });
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
            onChange={(e) => updateUsername(e.target.value)}
            placeholder="Enter username"
            className={getInputClassName("username")}
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "login-username-error" : undefined}
          />
          {errors.username && (
            <p id="login-username-error" className="mt-1 text-sm font-medium text-red-600">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            className={getInputClassName("password")}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
          />
          {errors.password && (
            <p id="login-password-error" className="mt-1 text-sm font-medium text-red-600">
              {errors.password}
            </p>
          )}
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
