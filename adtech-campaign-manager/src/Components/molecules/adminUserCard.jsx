import { Trash2 } from "lucide-react";

export default function AdminUserCard({
  user,
  isSuperAdmin,
  formatCurrency,
  onSelectUser,
  onRoleChange,
  onDeleteUser,
}) {
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
            className="mt-1 max-w-full break-words text-left font-bold text-blue-600 hover:underline"
          >
            {user.username}
          </button>
        </div>

        <div className="shrink-0">
          {isSuperAdmin ? (
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.id, e.target.value)}
              className="max-w-28 rounded-md border border-gray-300 bg-white p-2 text-sm capitalize text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-slate-200">
              {user.role}
            </span>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
          <dt className="text-xs text-gray-500 dark:text-slate-400">
            Campaigns
          </dt>
          <dd className="mt-1 text-lg font-bold">{user.campaignCount}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
          <dt className="text-xs text-gray-500 dark:text-slate-400">Budget</dt>
          <dd className="mt-1 break-words text-lg font-bold">
            {formatCurrency(user.totalBudget)}
          </dd>
        </div>
      </dl>

      {isSuperAdmin && (
        <button
          type="button"
          onClick={() => onDeleteUser(user.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete User
        </button>
      )}
    </article>
  );
}
