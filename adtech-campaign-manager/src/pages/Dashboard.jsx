import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns";

export default function Dashboard() {
  const { campaigns } = useCampaigns();
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active"
  ).length;

  const totalBudget = campaigns.reduce(
    (total, campaign) => total + Number(campaign.budget),
    0
  );

  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-500 text-sm">
            Analytics
          </h3>

          <h1 className="text-3xl font-bold">
            Campaign Dashboard
          </h1>
        </div>

        <Link
          to="/campaigns/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Create Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">
            Total Campaigns
          </h3>

          <p className="text-3xl font-bold">
            {totalCampaigns}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">
            Active Campaigns
          </h3>

          <p className="text-3xl font-bold">
            {activeCampaigns}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-500">
            Total Budget
          </h3>

          <p className="text-3xl font-bold">
            ₹{totalBudget.toLocaleString()}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white shadow rounded-lg h-80 flex flex-col">
          <h2 className="text-xl font-semibold p-5">
            Top Active Campaigns
          </h2>

          <div className="flex-1 flex items-center justify-center text-gray-400">
            Chart will come here
          </div>
        </div>

        <div className="bg-white shadow rounded-lg h-80 flex flex-col">
          <h2 className="text-xl font-semibold p-5">
            Budget Breakdown
          </h2>

          <div className="flex-1 flex items-center justify-center text-gray-400">
            Pie Chart will come here
          </div>
        </div>

      </div>

    </div>
  );
}
