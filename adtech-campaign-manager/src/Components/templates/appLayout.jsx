import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  ListChecks,
  PlusCircle,
} from "lucide-react";

import ThemeSwitcher from "../molecules/themeSwitcher.jsx";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-visible bg-gray-100 text-gray-950 transition-colors dark:bg-slate-950 dark:text-slate-100 lg:h-screen lg:flex-row lg:overflow-hidden">
      <aside className="flex shrink-0 flex-col border-b border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-4 flex items-center gap-3 lg:mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 font-bold text-white lg:h-12 lg:w-12">
            ACM
          </div>

          <div>
            <h2 className="text-lg font-bold">
              AdTech
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Campaign Manager
            </p>
          </div>

        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 ${
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
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 ${
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
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <PlusCircle size={18} />
            Create Campaign
          </NavLink>

        </nav>

    

        <div className="mt-4 lg:mt-auto">
          <ThemeSwitcher />
        </div>

      </aside>

      <main className="flex-1 overflow-visible p-3 sm:p-4 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden lg:p-6">
        <Outlet />
      </main>

    </div>
  );
}
