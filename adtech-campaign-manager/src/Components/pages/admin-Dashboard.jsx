import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";

import { useAuth } from "../../auth/useAuth.js";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import EmptyState from "../atoms/empty.jsx";
import StatCard from "../atoms/statCard.jsx";
import AdminCampaignCard from "../molecules/adminCampaignCard.jsx";
import AdminUserCard from "../molecules/adminUserCard.jsx";
import AdminCampaignsTable from "../organisms/adminCampaignsTable.jsx";
import AdminUsersTable from "../organisms/adminUsersTable.jsx";
import BarChart from "../organisms/barChart.jsx";
import BudgetDonutChart from "../organisms/donutChart.jsx";

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

export default function AdminDashboard({ showAnalytics = true }) {
  const { users, currentUser } = useAuth();
  const { campaigns, allCampaigns } = useCampaigns();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [budgetGroup, setBudgetGroup] = useState("platform");
  const isSuperAdmin = currentUser?.role === "superadmin";
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Completed", value: "completed" },
  ];
  const budgetGroups = [
    { label: "Platform", value: "platform" },
    { label: "Age", value: "ageGroup" },
  ];
  const regularUsers = useMemo(
    () => users.filter((user) => user.role !== "superadmin"),
    [users]
  );
  const userSummaries = useMemo(
    () =>
      regularUsers.map((user, index) => {
        const campaigns = allCampaigns.filter(
          (campaign) => campaign.ownerId === user.id
        );
        const totalBudget = campaigns.reduce(
          (sum, campaign) => sum + Number(campaign.budget || 0),
          0
        );

        return {
          ...user,
          displayId: user.displayId || String(index + 1),
          campaignCount: campaigns.length,
          totalBudget,
        };
      }),
    [allCampaigns, regularUsers]
  );

  const userById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users]
  );

  const selectedUser = selectedUserId ? userById[selectedUserId] : null;

  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const searchTerm = search.toLowerCase().trim();
    const owner = userById[campaign.ownerId];
    const matchesUser = campaign.ownerId === selectedUserId;
    const matchesSearch =
      searchTerm === "" ||
      campaign.name.toLowerCase().includes(searchTerm) ||
      campaign.platform.toLowerCase().includes(searchTerm) ||
      String(campaign.displayId || campaign.id)
        .toLowerCase()
        .includes(searchTerm) ||
      owner?.username.toLowerCase().includes(searchTerm);

    return matchesUser && matchesSearch;
  });

  const totalBudget = allCampaigns.reduce(
    (sum, campaign) => sum + Number(campaign.budget || 0),
    0
  );
  const activeCampaigns = allCampaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === "active"
  ).length;
  const analyticsCampaigns = isSuperAdmin ? allCampaigns : campaigns;
  const showDashboardAnalytics =
    showAnalytics && ["admin", "superadmin"].includes(currentUser?.role);
  const topCampaigns = [...analyticsCampaigns]
    .sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0))
    .slice(0, 5);
  const filteredStatusCampaigns = analyticsCampaigns.filter(
    (campaign) => String(campaign.status).toLowerCase() === selectedStatus
  );
  const groupedBudgets = filteredStatusCampaigns.reduce((groups, campaign) => {
    const groupName = campaign[budgetGroup] || "Not Set";

    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        budget: 0,
        campaigns: [],
      };
    }

    groups[groupName].budget += Number(campaign.budget || 0);
    groups[groupName].campaigns.push(campaign);

    return groups;
  }, {});
  const budgetBreakdown = Object.values(groupedBudgets);
  const filteredBudget = budgetBreakdown.reduce(
    (sum, item) => sum + item.budget,
    0
  );

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col p-3 sm:p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {isSuperAdmin ? "Full Application Control" : "Admin Monitoring"}
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/campaigns/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            <PlusCircle size={18} />
            Create Campaign
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={regularUsers.length} />
        <StatCard label="Total Campaigns" value={allCampaigns.length} />
        <StatCard label="Active Campaigns" value={activeCampaigns} />
        <StatCard label="Total Budget" value={formatCurrency(totalBudget)} />
      </div>

      {showDashboardAnalytics && (
        <section className="mt-6 grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex min-h-[420px] flex-col rounded-lg bg-white p-4 shadow dark:bg-slate-900 sm:p-5">
            <h2 className="mb-6 shrink-0 text-xl font-semibold">
              Top 5 Campaigns
            </h2>

            {topCampaigns.length > 0 ? (
              <div className="min-h-[320px] flex-1">
                <BarChart data={topCampaigns} />
              </div>
            ) : (
              <EmptyState
                title="No Campaigns"
                message="Top campaigns will appear here after campaigns are created."
                className="border-0 bg-transparent p-6 text-gray-400 dark:bg-transparent dark:text-slate-500"
              />
            )}
          </div>

          <div className="flex min-h-[420px] flex-col overflow-visible rounded-lg bg-white p-4 shadow dark:bg-slate-900 sm:p-5">
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
                    onChange={(event) => setBudgetGroup(event.target.value)}
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

            <div className="min-h-[320px] flex-1 overflow-visible">
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
        </section>
      )}

      {!showAnalytics && (
        <section className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {selectedUser ? `${selectedUser.username} Campaigns` : "Users"}
              </h2>
              {selectedUser && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserId(null);
                    setSearch("");
                  }}
                  className="mt-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Back to users
                </button>
              )}
            </div>

            {selectedUser && (
              <label className="relative w-full sm:w-80">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search selected user's campaigns"
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            )}
          </div>

          {!selectedUser && (
            <div className="campaign-list-scrollbar grid max-h-[calc(100dvh-300px)] gap-3 overflow-y-auto pr-1 lg:hidden md:grid-cols-2">
              {userSummaries.map((user) => (
                <AdminUserCard
                  key={user.id}
                  user={user}
                  isSuperAdmin={false}
                  formatCurrency={formatCurrency}
                  onSelectUser={setSelectedUserId}
                />
              ))}
            </div>
          )}

          {!selectedUser && (
            <AdminUsersTable
              users={userSummaries}
              isSuperAdmin={false}
              formatCurrency={formatCurrency}
              onSelectUser={setSelectedUserId}
            />
          )}

          {!selectedUser ? null : filteredCampaigns.length === 0 ? (
            <EmptyState
              title="No Campaigns Found"
              message={
                search.trim()
                  ? `No campaigns match your search for ${selectedUser.username}.`
                  : `${selectedUser.username} has not created any campaigns yet.`
              }
            />
          ) : (
            <div>
              <div className="campaign-list-scrollbar grid max-h-[calc(100dvh-340px)] gap-3 overflow-y-auto pr-1 lg:hidden md:grid-cols-2">
                {filteredCampaigns.map((campaign) => (
                  <AdminCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>

              <AdminCampaignsTable
                campaigns={filteredCampaigns}
                formatCurrency={formatCurrency}
              />
            </div>
          )}
        </section>
      )}

    </div>
  );
}
