import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../auth/useAuth.js";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import EmptyState from "../atoms/empty.jsx";

const STATUS_STYLES = {
  active: "border-green-200 bg-green-100 text-green-700",
  paused: "border-yellow-200 bg-yellow-100 text-yellow-700",
  completed: "border-blue-200 bg-blue-100 text-blue-700",
};

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

function formatStatus(status) {
  const normalizedStatus = String(status).toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export default function AdminDashboard() {
  const {
    users,
    currentUser,
    changeUserRole,
    deleteUser,
  } = useAuth();
  const { allCampaigns } = useCampaigns();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const isSuperAdmin = currentUser?.role === "superadmin";
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
          displayId: index + 1,
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

  function updateRole(userId, role) {
    const result = changeUserRole(userId, role);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("User role updated");
  }

  function removeUser(userId) {
    const result = deleteUser(userId);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    if (selectedUserId === userId) {
      setSelectedUserId(null);
      setSearch("");
    }

    toast.success("User deleted");
  }

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
        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold">{regularUsers.length}</h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">Total Campaigns</p>
          <h2 className="mt-2 text-3xl font-bold">{allCampaigns.length}</h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">Active Campaigns</p>
          <h2 className="mt-2 text-3xl font-bold">{activeCampaigns}</h2>
        </div>

        <div className="rounded-lg bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-gray-500 dark:text-slate-400">Total Budget</p>
          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(totalBudget)}
          </h2>
        </div>
      </div>

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
          <div className="campaign-list-scrollbar overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-900">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Username</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-right">Campaigns</th>
                  <th className="p-4 text-right">Overall Budget</th>
                  {isSuperAdmin && <th className="p-4 text-center">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {userSummaries.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                  >
                    <td className="p-4 font-semibold text-gray-500 dark:text-slate-400">
                      {user.displayId}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(user.id)}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {user.username}
                      </button>
                    </td>
                    <td className="p-4">
                      {isSuperAdmin ? (
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="rounded-md border border-gray-300 bg-white p-2 text-sm capitalize text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="capitalize">{user.role}</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {user.campaignCount}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {formatCurrency(user.totalBudget)}
                    </td>
                    {isSuperAdmin && (
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeUser(user.id)}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            aria-label="Delete user"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <div className="campaign-list-scrollbar overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-900">
            <table className="w-full min-w-[960px]">
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
                {filteredCampaigns.map((campaign) => {
                  const status = String(campaign.status).toLowerCase();

                  return (
                    <tr
                      key={campaign.id}
                      className="border-t border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                    >
                      <td className="p-4">
                        <span className="block font-medium">
                          {campaign.name}
                        </span>
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
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${
                            STATUS_STYLES[status] || STATUS_STYLES.active
                          }`}
                        >
                          {formatStatus(campaign.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleDateString()
                          : "Not available"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
