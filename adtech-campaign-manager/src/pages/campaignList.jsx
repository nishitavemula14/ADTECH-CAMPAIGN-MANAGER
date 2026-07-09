import { useState } from "react";
import { Link } from "react-router-dom";
import { useCampaigns } from "../hooks/useCampaigns.js";

export default function CampaignList() {
  const { campaigns } = useCampaigns();

  const [search, setSearch] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">

     
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-500">Manage all your campaigns</p>
        </div>

        <Link
          to="/campaigns/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Campaign
        </Link>
      </div>

    
      <input
        type="text"
        placeholder="Search Campaign..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded p-2 mb-5"
      />

   
      {filteredCampaigns.length === 0 ? (
        <div className="text-center border rounded p-10 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">
            No Campaigns Found
          </h2>
          <p className="text-gray-500">
            Create your first campaign.
          </p>
        </div>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Platform</th>
              <th className="border p-3">Audience</th>
              <th className="border p-3">Budget</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="border p-3">{campaign.name}</td>
                <td className="border p-3">{campaign.platform}</td>
                <td className="border p-3">{campaign.ageGroup}</td>
                <td className="border p-3">₹{campaign.budget}</td>
                <td className="border p-3">{campaign.status}</td>

                <td className="border p-3">
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="text-blue-600 mr-3"
                  >
                    View
                  </Link>

                  <Link
                    to={`/campaigns/${campaign.id}/edit`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}


