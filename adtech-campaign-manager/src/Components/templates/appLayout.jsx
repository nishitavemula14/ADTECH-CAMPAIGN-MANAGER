import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  ListChecks,
  PlusCircle,
} from "lucide-react";

import ThemeSwitcher from "../molecules/themeSwitcher.jsx";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Sidebar */}
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-white p-5 shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            ACM
          </div>

          <div>
            <h2 className="font-bold text-lg">
              AdTech
            </h2>

            <p className="text-gray-500 text-sm">
              Campaign Manager
            </p>
          </div>

        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-2">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <BarChart3 size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <ListChecks size={18} />
            Campaigns
          </NavLink>

          <NavLink
            to="/campaigns/new"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <PlusCircle size={18} />
            Create Campaign
          </NavLink>

        </nav>

    

        <div className="mt-auto">
          <ThemeSwitcher />
        </div>

      </aside>

      <main className="h-screen flex-1 overflow-y-auto overflow-x-hidden p-6">
        <Outlet />
      </main>

    </div>
  );
}
