import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns";

const STATUS_STYLES = {
  active: "border-green-200 bg-green-100 text-green-700",
  paused: "border-yellow-200 bg-yellow-100 text-yellow-700",
  completed: "border-blue-200 bg-blue-100 text-blue-700",
};

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

export default function CampaignList() {
  const { campaigns, deleteCampaign, updateCampaign } = useCampaigns();
  const [search, setSearch] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchTerm = search.toLowerCase().trim();

    return (
      campaign.name.toLowerCase().includes(searchTerm) ||
      String(campaign.id).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-500">Manage all your campaigns</p>
        </div>

        <Link
          to="/campaigns/new"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          + Create Campaign
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search Campaign..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredCampaigns.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 p-10 text-center">
          <h2 className="text-xl font-semibold">No Campaigns Found</h2>
          <p className="mt-2 text-gray-500">Create your first campaign.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Campaign</th>
                <th className="p-4 text-left">Platform</th>
                <th className="p-4 text-left">Audience</th>
                <th className="p-4 text-right">Budget</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCampaigns.map((campaign) => {
                const status = String(campaign.status).toLowerCase();

                return (
                  <tr
                    key={campaign.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold text-gray-500">
                      {campaign.id}
                    </td>

                    <td className="p-4 font-medium">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-blue-600 transition hover:text-blue-700 hover:underline"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="p-4">{campaign.platform}</td>
                    <td className="p-4">{campaign.ageGroup}</td>

                    <td className="p-4 text-right">
                      {formatCurrency(campaign.budget)}
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={status}
                        onChange={(e) =>
                          updateCampaign(campaign.id, {
                            status: e.target.value,
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-sm font-semibold capitalize outline-none ${
                          STATUS_STYLES[status] || STATUS_STYLES.active
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/campaigns/${campaign.id}/edit`}
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                          title="Edit campaign"
                          aria-label="Edit campaign"
                        >
                          <Edit size={18} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Delete this campaign?")) {
                              deleteCampaign(campaign.id);
                            }
                          }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Delete campaign"
                          aria-label="Delete campaign"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
