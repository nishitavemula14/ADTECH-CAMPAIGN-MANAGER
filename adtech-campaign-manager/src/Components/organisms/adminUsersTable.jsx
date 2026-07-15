import { Trash2 } from "lucide-react";
import { getUserLabel } from "../../lib/userDisplay.js";

export default function AdminUsersTable({
  users,
  isSuperAdmin,
  onSelectUser,
  onRoleChange,
  onDeleteUser,
}) {
  return (
    <div className="campaign-list-scrollbar hidden max-h-[calc(100dvh-300px)] overflow-auto rounded-lg bg-white shadow dark:bg-slate-900 lg:block">
      <table className="w-full min-w-[860px]">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-right">Campaigns</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const nextRole = user.role === "admin" ? "user" : "admin";
            const userLabel = getUserLabel(user);

            return (
              <tr
                key={user.id}
                className="border-t border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
              >
                <td className="p-4 font-semibold text-gray-500 dark:text-slate-400">
                  {user.displayId}
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => onSelectUser(user.id)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {userLabel}
                  </button>
                </td>
                <td className="max-w-64 break-all p-4 text-sm font-medium text-gray-600 dark:text-slate-300">
                  {user.username}
                </td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4 text-right font-semibold">
                  {user.campaignCount}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {isSuperAdmin ? (
                      <>
                      <button
                        type="button"
                        onClick={() => onRoleChange(user.id, nextRole)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {user.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user.id)}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        aria-label="Delete user"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                      </>
                    ) : (
                      <span className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-500 dark:bg-slate-800 dark:text-slate-300">
                        Read only
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
