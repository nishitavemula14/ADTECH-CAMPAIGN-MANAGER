import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

import StatusBadge from "../atoms/statusBadge.jsx";

export default function AdminCampaignCard({
  campaign,
  formatCurrency,
  canManage = false,
  editState,
  onDeleteCampaign,
  onStatusChange,
}) {
  const status = String(campaign.status).toLowerCase();

  return (
    <article className="min-w-0 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            Campaign ID {campaign.displayId || campaign.id}
          </p>
          <h3 className="mt-1 break-words text-base font-bold [overflow-wrap:anywhere]">
            {campaign.name}
          </h3>
        </div>
        {canManage ? (
          <select
            value={status}
            onChange={(event) => onStatusChange(campaign.id, event.target.value)}
            className="w-fit max-w-full shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold capitalize text-gray-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <StatusBadge status={campaign.status} className="w-fit shrink-0" />
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500 dark:text-slate-400">Platform</dt>
          <dd className="mt-1 font-semibold">{campaign.platform}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-slate-400">Audience</dt>
          <dd className="mt-1 font-semibold">{campaign.ageGroup}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-slate-400">Budget</dt>
          <dd className="mt-1 break-words font-semibold">
            {formatCurrency(campaign.budget)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end gap-2">
        {canManage ? (
          <>
          <Link
            to={`/campaigns/${campaign.id}/edit`}
            state={editState}
            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
            title="Edit campaign"
            aria-label="Edit campaign"
          >
            <Edit size={18} />
          </Link>
          <button
            type="button"
            onClick={() => onDeleteCampaign(campaign)}
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
            title="Delete campaign"
            aria-label="Delete campaign"
          >
            <Trash2 size={18} />
          </button>
          </>
        ) : (
          <span className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-400 dark:bg-slate-800">
            Read only
          </span>
        )}
      </div>
    </article>
  );
}
