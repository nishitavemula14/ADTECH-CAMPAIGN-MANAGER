import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/useAuth.js";

export default function Signup() {
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const inputClassName =
    "w-full rounded-md border bg-white p-3 text-gray-900 focus:outline-none dark:bg-slate-950 dark:text-slate-100";

  function getInputClassName(fieldName) {
    return errors[fieldName]
      ? `${inputClassName} border-red-500 focus:border-red-500 dark:border-red-500`
      : `${inputClassName} border-gray-300 focus:border-blue-500 dark:border-slate-700`;
  }

  function updateField(fieldName, value, setter) {
    setter(value);
    setErrors((currentErrors) => ({ ...currentErrors, [fieldName]: "" }));
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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

    if (confirmPassword === "") {
      nextErrors.confirmPassword = "Confirm password is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (username.trim().includes("@")) {
      setErrors({ username: "Use a username, not an email address" });
      return;
    }

    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const result = signup(username, password);

    if (!result.ok) {
      setErrors({ username: result.message || "Unable to create account" });
      return;
    }

    toast.success("Account created successfully. Please login.");
    navigate("/login", { replace: true });
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
            Sign Up
          </h1>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => updateField("username", e.target.value, setUsername)}
            placeholder="Choose a username"
            className={getInputClassName("username")}
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "signup-username-error" : undefined}
          />
          {errors.username && (
            <p id="signup-username-error" className="mt-1 text-sm font-medium text-red-600">
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
            onChange={(e) => updateField("password", e.target.value, setPassword)}
            className={getInputClassName("password")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "signup-password-error" : undefined}
          />
          {errors.password && (
            <p id="signup-password-error" className="mt-1 text-sm font-medium text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              updateField("confirmPassword", e.target.value, setConfirmPassword)
            }
            className={getInputClassName("confirmPassword")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "signup-confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <p
              id="signup-confirm-password-error"
              className="mt-1 text-sm font-medium text-red-600"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
