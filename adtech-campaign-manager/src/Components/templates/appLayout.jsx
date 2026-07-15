import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ListChecks,
  LogOut,
  PlusCircle,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../auth/useAuth.js";
import { getUserInitial, getUserLabel } from "../../lib/userDisplay.js";
import ThemeSwitcher from "../molecules/themeSwitcher.jsx";

export default function AppLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const hasAdminDashboard = ["admin", "superadmin"].includes(currentUser?.role);
  const currentUserLabel = getUserLabel(currentUser);

  function showCenteredToast(message, options = {}) {
    return toast(message, {
      ...options,
      position: "top-center",
      style: {
        left: "50%",
        margin: 0,
        position: "fixed",
        top: "50%",
        transform: "translate(-50%, -50%)",
        ...(options.style || {}),
      },
    });
  }

  function confirmLogout() {
    toast.custom(
      (toastItem) => (
        <div
          className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 shadow-xl dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-bold text-gray-900 dark:text-slate-100">
            Do you want to logout?
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.dismiss(toastItem.id);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              No
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.dismiss(toastItem.id);
                logout();
                navigate("/login", { replace: true });
                showCenteredToast("Logged out successfully", {
                  duration: 800,
                });
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          left: "50%",
          margin: 0,
          position: "fixed",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-visible bg-gray-100 text-gray-950 transition-colors dark:bg-slate-950 dark:text-slate-100 lg:h-screen lg:flex-row lg:overflow-hidden">
      <aside className="sticky top-0 z-40 flex shrink-0 flex-col border-b border-gray-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-4 lg:static lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 lg:pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white lg:h-12 lg:w-12 lg:text-base">
            ACM
          </div>

          <div>
            <h2 className="text-base font-bold sm:text-lg">
              AdTech
            </h2>

            <p className="text-xs text-gray-500 dark:text-slate-400 sm:text-sm">
              Campaign Manager
            </p>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-slate-800" />

        <nav className="grid grid-cols-[repeat(5,max-content)] gap-2 overflow-x-auto py-3 sm:grid-cols-[repeat(6,max-content)] lg:flex lg:flex-1 lg:flex-col lg:overflow-visible lg:py-4">
          <div className="col-span-full flex min-w-0 items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-slate-800/70 sm:p-3 lg:col-auto">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              {getUserInitial(currentUser)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-slate-100">
                {currentUserLabel}
              </p>
              <p className="hidden text-xs capitalize text-gray-500 dark:text-slate-400 sm:block">
                {currentUser?.role}
              </p>
            </div>
          </div>

          <NavLink
            to={hasAdminDashboard ? "/admin" : "/"}
            className={({ isActive }) =>
              `flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm sm:gap-3 sm:text-base lg:justify-start ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <BarChart3 size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/campaigns"
            end
            className={({ isActive }) =>
              `flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm sm:gap-3 sm:text-base lg:justify-start ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <ListChecks size={18} />
            Campaigns
          </NavLink>

          <NavLink
            to="/campaigns/new"
            className={({ isActive }) =>
              `flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm sm:gap-3 sm:text-base lg:justify-start ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <PlusCircle size={18} />
            Create Campaign
          </NavLink>

          {["admin", "superadmin"].includes(currentUser?.role) && (
            <NavLink
              to={
                currentUser?.role === "superadmin"
                  ? "/super-admin"
                  : "/admin-monitor"
              }
              className={({ isActive }) =>
                `flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm sm:gap-3 sm:text-base lg:justify-start ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Users size={18} />
              {currentUser?.role === "superadmin" ? "Super Admin" : "Admin"}
            </NavLink>
          )}

        </nav>

        <div className="border-t border-gray-200 dark:border-slate-800" />

        <div className="pt-3 lg:pt-4">
          <div className="grid grid-cols-2 gap-1 lg:mt-3 lg:grid-cols-1">
            <ThemeSwitcher />

            <button
              type="button"
              onClick={confirmLogout}
              className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

      </aside>

      <main className="min-w-0 flex-1 overflow-visible p-2 sm:p-4 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden lg:p-6">
        <Outlet />
      </main>

    </div>
  );
}
