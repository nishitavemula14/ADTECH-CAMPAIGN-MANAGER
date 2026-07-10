import { useState } from "react";
import { Link } from "react-router-dom";
import { useCampaigns } from "../hooks/useCampaigns";

export default function CampaignList() {
  const {
    campaigns,
    deleteCampaign,
    toggleStatus,
  } = useCampaigns();

  const [search, setSearch] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-500">
            Manage all your campaigns
          </p>
        </div>

        <Link
          to="/campaigns/new"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Campaign
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Campaign..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {filteredCampaigns.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Campaigns Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first campaign.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Campaign</th>
                <th className="text-left p-4">Platform</th>
                <th className="text-left p-4">Audience</th>
                <th className="text-right p-4">Budget</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCampaigns.map((campaign) => (

                <tr
                  key={campaign.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {campaign.name}
                  </td>

                  <td className="p-4">
                    {campaign.platform}
                  </td>

                  <td className="p-4">
                    {campaign.ageGroup}
                  </td>

                  <td className="p-4 text-right">
                    ₹{Number(campaign.budget).toLocaleString()}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => toggleStatus(campaign.id)}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        campaign.status === "active"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {campaign.status === "active"
                        ? "Active"
                        : "Paused"}
                    </button>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        to={`/campaigns/${campaign.id}/edit`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this campaign?"
                            )
                          ) {
                            deleteCampaign(campaign.id);
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}