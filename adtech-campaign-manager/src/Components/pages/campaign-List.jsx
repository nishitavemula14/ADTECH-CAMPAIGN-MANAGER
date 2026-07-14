import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/useAuth.js";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import EmptyState from "../atoms/empty.jsx";

const STATUS_STYLES = {
  active: "border-green-200 bg-green-100 text-green-700",
  paused: "border-yellow-200 bg-yellow-100 text-yellow-700",
  completed: "border-blue-200 bg-blue-100 text-blue-700",
};

const DEFAULT_PLATFORM_OPTIONS = [
  "Google Ads",
  "Facebook",
  "Instagram",
  "LinkedIn",
];

const STATUS_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
];

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

export default function CampaignList() {
  const { currentUser } = useAuth();
  const { campaigns, deleteCampaign, deleteAllCampaigns, updateCampaign } =
    useCampaigns();
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const isAdmin = currentUser?.role === "admin";
  const isSuperAdmin = currentUser?.role === "superadmin";
  const canBulkDelete = !isAdmin;

  function canManageCampaign(campaign) {
    return isSuperAdmin || campaign.ownerId === currentUser?.id;
  }

  function confirmDeleteCampaign(campaign) {
    setCampaignToDelete(campaign);
  }

  function confirmDeleteAllCampaigns() {
    if (campaigns.length === 0) {
      toast.error("No campaigns to delete");
      return;
    }

    toast.custom(
      (toastItem) => (
        <div
          className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 shadow-xl dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-bold text-gray-900 dark:text-slate-100">
            Should I delete all the list?
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.dismiss(toastItem.id);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              No
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteAllCampaigns();
                setCampaignToDelete(null);
                toast.dismiss(toastItem.id);
                toast.success("All campaigns deleted successfully");
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          left: "50%",
          margin: 0,
          position: "fixed",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
      }
    );
  }

  const platformOptions = [
    ...new Set([
      ...DEFAULT_PLATFORM_OPTIONS,
      ...campaigns.map((campaign) => campaign.platform).filter(Boolean),
    ]),
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchTerm = search.toLowerCase().trim();
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm) ||
      String(campaign.displayId || campaign.id)
        .toLowerCase()
        .includes(searchTerm);
    const matchesPlatform =
      platformFilter === "all" || campaign.platform === platformFilter;
    const matchesStatus =
      statusFilter === "all" ||
      String(campaign.status).toLowerCase() === statusFilter;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col overflow-visible p-3 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
      <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Campaigns</h1>
          <p className="text-gray-500 dark:text-slate-400">Manage all your campaigns</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/campaigns/new"
            className="w-full rounded-lg bg-blue-600 px-5 py-2 text-center text-white hover:bg-blue-700 sm:w-auto"
          >
            + Create Campaign
          </Link>

          <button
            type="button"
            onClick={confirmDeleteAllCampaigns}
            className="w-full rounded-lg bg-red-600 px-5 py-2 text-center font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 sm:w-auto"
            disabled={campaigns.length === 0 || !canBulkDelete}
          >
            Delete All
          </button>
        </div>
      </div>

      <div className="mb-6 flex shrink-0 flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search Campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-56"
          aria-label="Filter campaigns by platform"
        >
          <option value="all">All Platforms</option>
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 grid w-full shrink-0 grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1 dark:bg-slate-800 sm:grid-cols-4 lg:w-fit">
        {STATUS_FILTER_OPTIONS.map((status) => {
          const isActive = statusFilter === status.value;

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 ? (
        <EmptyState
          title="No Campaigns Found"
          message={
            statusFilter === "all"
              ? "Create your first campaign."
              : `No ${statusFilter} campaigns found.`
          }
        />
      ) : (
        <div className="campaign-list-scrollbar flex-1 overflow-x-auto rounded-xl bg-white shadow dark:bg-slate-900 lg:min-h-0 lg:overflow-y-scroll lg:[scrollbar-gutter:stable]">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-800">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Campaign</th>
                <th className="p-4 text-left">Platform</th>
                <th className="p-4 text-left">Audience</th>
                <th className="p-4 text-right">Budget (₹)</th>
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
                    className="border-t border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                  >
                    <td className="p-4 font-semibold text-gray-500 dark:text-slate-400">
                      {campaign.displayId || campaign.id}
                    </td>

                    <td className="max-w-72 p-4 align-top font-medium">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="block whitespace-normal break-words leading-snug text-blue-600 transition hover:text-blue-700 hover:underline"
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
                      {canManageCampaign(campaign) ? (
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
                      ) : (
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold capitalize ${
                            STATUS_STYLES[status] || STATUS_STYLES.active
                          }`}
                        >
                          {status}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {canManageCampaign(campaign) ? (
                          <>
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
                              onClick={() => confirmDeleteCampaign(campaign)}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                              title="Delete campaign"
                              aria-label="Delete campaign"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-400">
                            Read only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {campaignToDelete && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="pointer-events-auto w-96 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-6 text-center shadow-2xl dark:bg-slate-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
              Delete Campaign?
            </h2>

            <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
              Should I delete{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {campaignToDelete.name}
              </span>{" "}
              permanently?
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setCampaignToDelete(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteCampaign(campaignToDelete.id);
                  toast.success(`${campaignToDelete.name} deleted successfully`);
                  setCampaignToDelete(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
