import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import { useCampaigns } from "../hooks/useCampaigns";

import BarChart from "../Components/molecules/barChart.jsx";
import BudgetDonutChart from "../Components/molecules/donutChart.jsx";

export default function Dashboard() {
  const { campaigns } = useCampaigns();

  // Filter donut by campaign status and grouping.
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [budgetGroup, setBudgetGroup] = useState("platform");

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Completed", value: "completed" },
  ];
  const budgetGroups = [
    { label: "Platform", value: "platform" },
    { label: "Age", value: "ageGroup" },
  ];

  // Filter campaigns for donut
  const filteredCampaigns = campaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === selectedStatus
  );

  // Dashboard cards
  const totalCampaigns = campaigns.length;

  const activeCampaigns = campaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === "active"
  ).length;

  const totalBudget = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.budget),
    0
  );

  // Bar Chart
  const topActiveCampaigns = campaigns
    .filter((campaign) => String(campaign.status).toLowerCase() === "active")
    .sort((a, b) => Number(b.budget) - Number(a.budget))
    .slice(0, 5);

  // Donut Data
  const groupedBudgets = {};

  filteredCampaigns.forEach((campaign) => {
    const groupName = campaign[budgetGroup] || "Not Set";

    if (!groupedBudgets[groupName]) {
      groupedBudgets[groupName] = {
        name: groupName,
        budget: 0,
        campaigns: [],
      };
    }

    groupedBudgets[groupName].budget += Number(campaign.budget);
    groupedBudgets[groupName].campaigns.push(campaign);
  });

  const budgetBreakdown = Object.values(groupedBudgets);

  const filteredBudget = budgetBreakdown.reduce(
    (sum, item) => sum + item.budget,
    0
  );

  return (
    <div className="p-6">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Analytics
          </p>

          <h1 className="text-3xl font-bold">
            Campaign Dashboard
          </h1>
        </div>

        <Link
          to="/campaigns/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Create Campaign
        </Link>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-gray-500">
            Total Campaigns
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalCampaigns}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-gray-500">
            Active Campaigns
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeCampaigns}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-gray-500">
            Total Budget
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ₹{totalBudget.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Charts */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}

        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="mb-6 text-xl font-semibold">
            Top 5 Active Campaigns
          </h2>

          {topActiveCampaigns.length > 0 ? (
            <BarChart data={topActiveCampaigns} />
          ) : (
            <div className="flex h-72 items-center justify-center text-gray-400">
              No active campaigns available
            </div>
          )}
        </div>

        {/* Donut Chart */}

        <div className="rounded-lg bg-white p-5 shadow">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">
              Budget Breakdown By{" "}
              {budgetGroup === "platform" ? "Platform" : "Age"}
            </h2>

            <div className="w-full sm:w-40">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Group By
                <select
                  value={budgetGroup}
                  onChange={(e) => setBudgetGroup(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-gray-900 focus:border-blue-500 focus:outline-none"
                >
                  {budgetGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <BudgetDonutChart
              data={budgetBreakdown}
              totalBudget={filteredBudget}
              groupBy={budgetGroup}
              selectedStatus={selectedStatus}
              statusOptions={statusOptions}
              onStatusChange={setSelectedStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
