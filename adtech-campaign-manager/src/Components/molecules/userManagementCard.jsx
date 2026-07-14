import { Trash2 } from "lucide-react";

export default function UserManagementCard({
  user,
  onDeleteUser,
  onRoleChange,
}) {
  return (
    <article className="rounded-lg bg-white p-4 shadow dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            ID {user.displayId}
          </p>
          <h2 className="mt-1 break-words text-base font-bold sm:text-lg">
            {user.username}
          </h2>
        </div>

        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-slate-200">
          {user.role}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            onRoleChange(user, user.role === "admin" ? "user" : "admin")
          }
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
        </button>

        <button
          type="button"
          onClick={() => onDeleteUser(user)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete User
        </button>
      </div>
    </article>
  );
}
