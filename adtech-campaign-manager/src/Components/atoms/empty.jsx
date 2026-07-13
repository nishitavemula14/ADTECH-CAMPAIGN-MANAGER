import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCampaigns } from "../../hooks/useCampaigns";


const STATUS_STYLES = {
  active: "border-green-200 bg-green-100 text-green-700",
  paused: "border-yellow-200 bg-yellow-100 text-yellow-700",
};


function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}


export default function CampaignList() {
  const { campaigns, deleteCampaign } = useCampaigns();
  const [search, setSearch] = useState("");


  function confirmDeleteCampaign(campaign) {
    toast.custom(
      (toastItem) => (
        <div className="w-96 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-5 text-center shadow-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            Delete Campaign?
          </h2>


          <p className="mt-2 text-sm text-gray-600">
            Should I delete{" "}
            <span className="font-bold text-gray-900">
              {campaign.name}
            </span>{" "}
            permanently?
          </p>


          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => toast.dismiss(toastItem.id)}
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={() => {
                deleteCampaign(campaign.id);
                toast.dismiss(toastItem.id);
                toast.success(`${campaign.name} deleted permanently`);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  }


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
                  <tr key={campaign.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-left">{campaign.id}</td>
                    <td className="p-4 text-left">{campaign.name}</td>
                    <td className="p-4 text-left">{campaign.platform}</td>
                    <td className="p-4 text-left">{campaign.audience}</td>
                    <td className="p-4 text-right">{formatCurrency(campaign.budget)}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
                          STATUS_STYLES[status] || "border-gray-200 bg-gray-100 text-gray-700"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/campaigns/${campaign.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => confirmDeleteCampaign(campaign)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
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







