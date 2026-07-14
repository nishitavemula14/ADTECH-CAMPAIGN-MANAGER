import StatusBadge from "../atoms/statusBadge.jsx";

export default function AdminCampaignCard({ campaign, formatCurrency }) {
  return (
    <article className="rounded-lg bg-white p-4 shadow dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            Campaign ID {campaign.displayId || campaign.id}
          </p>
          <h3 className="mt-1 break-words text-base font-bold">
            {campaign.name}
          </h3>
        </div>
        <StatusBadge status={campaign.status} className="shrink-0" />
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
        <div>
          <dt className="text-gray-500 dark:text-slate-400">Created</dt>
          <dd className="mt-1 font-semibold">
            {campaign.createdAt
              ? new Date(campaign.createdAt).toLocaleDateString()
              : "Not available"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
