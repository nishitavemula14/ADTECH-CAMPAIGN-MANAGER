import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import { useCampaigns } from "../../hooks/useCampaigns.js";
import { formatCurrency } from "../../lib/formatter.js";

import EmptyState from "../atoms/empty.jsx";
import BarChart from "../organisms/barChart.jsx";
import BudgetDonutChart from "../organisms/donutChart.jsx";

export default function Dashboard() {
  const { campaigns } = useCampaigns();
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
  const filteredCampaigns = campaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === selectedStatus
  );
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === "active"
  ).length;

  const totalBudget = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.budget),
    0
  );
  const topCampaigns = campaigns
    .filter((campaign) => String(campaign.status).toLowerCase() === "active")
    .sort((a, b) => Number(b.budget) - Number(a.budget))
    .slice(0, 5);
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
    <div className="flex min-h-full flex-col overflow-visible p-3 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
      <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Analytics
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Campaign Dashboard
          </h1>
        </div>

        <Link
          to="/campaigns/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <PlusCircle size={18} />
          Create Campaign
        </Link>
      </div>


      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">
            Total Campaigns
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalCampaigns}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">
            Active Campaigns
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeCampaigns}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">
            Total Budget
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(totalBudget)}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex min-h-[420px] flex-col rounded-lg bg-white p-4 shadow dark:bg-slate-900 sm:p-5 lg:min-h-0">
          <h2 className="mb-6 shrink-0 text-xl font-semibold">
            Top 5 Active Campaigns
          </h2>

          {topCampaigns.length > 0 ? (
            <div className="min-h-[320px] flex-1 lg:min-h-0">
              <BarChart data={topCampaigns} />
            </div>
          ) : (
            <EmptyState
              title="No Campaigns"
              message="Active campaigns will appear here."
              className="border-0 bg-transparent p-6 text-gray-400 dark:bg-transparent dark:text-slate-500"
            />
          )}
        </div>

        <div className="flex min-h-[420px] flex-col overflow-visible rounded-lg bg-white p-4 shadow dark:bg-slate-900 sm:p-5 lg:min-h-0">
          <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">
              Budget Breakdown By{" "}
              {budgetGroup === "platform" ? "Platform" : "Age"}
            </h2>

            <div className="w-full sm:w-40">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Group By
                <select
                  value={budgetGroup}
                  onChange={(e) => setBudgetGroup(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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

          <div className="min-h-[320px] flex-1 overflow-visible lg:min-h-0">
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
