import { Trash2 } from "lucide-react";

export default function UserManagementTable({
  users,
  onDeleteUser,
  onRoleChange,
}) {
  return (
    <div className="campaign-list-scrollbar hidden max-h-[calc(100dvh-220px)] overflow-auto rounded-lg bg-white shadow dark:bg-slate-900 lg:block">
      <table className="w-full min-w-[720px]">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-center">Actions</th>
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
              <td className="max-w-md p-4 font-semibold">
                <span className="block break-words">{user.username}</span>
              </td>
              <td className="p-4 capitalize">{user.role}</td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onRoleChange(
                        user,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {user.role === "admin"
                      ? "Demote to User"
                      : "Promote to Admin"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteUser(user)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    aria-label="Delete user"
                    title="Delete user"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
