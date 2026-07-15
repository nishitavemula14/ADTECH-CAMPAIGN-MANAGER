import { Trash2 } from "lucide-react";
import { getUserLabel } from "../../lib/userDisplay.js";

export default function AdminUserCard({
  user,
  isSuperAdmin,
  onSelectUser,
  onRoleChange,
  onDeleteUser,
}) {
  const nextRole = user.role === "admin" ? "user" : "admin";
  const userLabel = getUserLabel(user);

  return (
    <article className="rounded-lg bg-white p-4 shadow dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            ID {user.displayId}
          </p>
          <button
            type="button"
            onClick={() => onSelectUser(user.id)}
            className="mt-1 max-w-full break-words text-left text-base font-bold text-blue-600 hover:underline sm:text-lg"
          >
            {userLabel}
          </button>
          <p className="mt-1 break-words text-sm font-medium text-gray-600 dark:text-slate-300">
            {user.username}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-slate-200">
          {user.role}
        </span>
      </div>

      <dl className="mt-4 grid gap-3">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
          <dt className="text-xs text-gray-500 dark:text-slate-400">
            Campaigns
          </dt>
          <dd className="mt-1 text-lg font-bold">{user.campaignCount}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {isSuperAdmin ? (
          <>
          <button
            type="button"
            onClick={() => onRoleChange(user.id, nextRole)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {user.role === "admin" ? "Demote" : "Promote"}
          </button>
          <button
            type="button"
            onClick={() => onDeleteUser(user.id)}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
          </>
        ) : (
          <span className="rounded-lg bg-gray-50 px-3 py-2 text-center text-sm font-semibold text-gray-500 dark:bg-slate-800 dark:text-slate-300 sm:col-span-2">
            Read only
          </span>
        )}
      </div>
    </article>
  );
}
