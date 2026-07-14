import StatusBadge from "../atoms/statusBadge.jsx";

export default function AdminCampaignsTable({ campaigns, formatCurrency }) {
  return (
    <div className="campaign-list-scrollbar hidden max-h-[calc(100dvh-340px)] overflow-auto rounded-lg bg-white shadow dark:bg-slate-900 lg:block">
      <table className="w-full min-w-[860px]">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th className="p-4 text-left">Campaign</th>
            <th className="p-4 text-left">Platform</th>
            <th className="p-4 text-left">Audience</th>
            <th className="p-4 text-right">Budget</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign) => (
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
                <StatusBadge status={campaign.status} />
              </td>
              <td className="p-4">
                {campaign.createdAt
                  ? new Date(campaign.createdAt).toLocaleDateString()
                  : "Not available"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
