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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (username.trim() === "" || password === "" || confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = signup(username, password);

    if (!result.ok) {
      toast.error(result.message);
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
            Username or email
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
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
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            autoComplete="new-password"
          />
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
