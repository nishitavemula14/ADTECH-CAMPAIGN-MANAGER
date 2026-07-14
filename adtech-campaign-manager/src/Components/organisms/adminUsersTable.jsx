import { Trash2 } from "lucide-react";

export default function AdminUsersTable({
  users,
  isSuperAdmin,
  formatCurrency,
  onSelectUser,
  onRoleChange,
  onDeleteUser,
}) {
  return (
    <div className="campaign-list-scrollbar hidden max-h-[calc(100dvh-300px)] overflow-auto rounded-lg bg-white shadow dark:bg-slate-900 lg:block">
      <table className="w-full min-w-[720px]">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-right">Campaigns</th>
            <th className="p-4 text-right">Overall Budget</th>
            {isSuperAdmin && <th className="p-4 text-center">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
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
                  {user.username}
                </button>
              </td>
              <td className="p-4">
                {isSuperAdmin ? (
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="rounded-md border border-gray-300 bg-white p-2 text-sm capitalize text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="capitalize">{user.role}</span>
                )}
              </td>
              <td className="p-4 text-right font-semibold">
                {user.campaignCount}
              </td>
              <td className="p-4 text-right font-semibold">
                {formatCurrency(user.totalBudget)}
              </td>
              {isSuperAdmin && (
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteUser(user.id)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      aria-label="Delete user"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
