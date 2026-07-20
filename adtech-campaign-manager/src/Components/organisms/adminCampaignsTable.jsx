import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

import StatusBadge from "../atoms/statusBadge.jsx";

export default function AdminCampaignsTable({
  campaigns,
  formatCurrency,
  canManage = false,
  editState,
  onDeleteCampaign,
  onStatusChange,
}) {
  return (
    <div className="campaign-list-scrollbar hidden max-h-[calc(100dvh-340px)] overflow-auto rounded-lg bg-white shadow dark:bg-slate-900 xl:block">
      <table className="w-full min-w-[860px]">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th className="p-4 text-left">Campaign</th>
            <th className="p-4 text-left">Platform</th>
            <th className="p-4 text-left">Audience</th>
            <th className="p-4 text-right">Budget</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign) => {
            const status = String(campaign.status).toLowerCase();

            return (
              <tr
                key={campaign.id}
                className="border-t border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
              >
                <td className="p-4">
                  <span className="block font-medium">{campaign.name}</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    ID: {campaign.displayId || campaign.id}
                  </span>
                </td>
                <td className="p-4">{campaign.platform}</td>
                <td className="p-4">{campaign.ageGroup}</td>
                <td className="p-4 text-right font-semibold">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="p-4 text-center">
                  {canManage ? (
                    <select
                      value={status}
                      onChange={(event) =>
                        onStatusChange(campaign.id, event.target.value)
                      }
                      className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-semibold capitalize text-gray-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <StatusBadge status={campaign.status} />
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
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
