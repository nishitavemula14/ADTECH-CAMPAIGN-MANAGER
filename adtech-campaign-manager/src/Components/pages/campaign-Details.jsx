import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { useAuth } from "../../auth/useAuth.js";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import { formatCurrency } from "../../lib/formatter.js";
import { getUserLabel } from "../../lib/userDisplay.js";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

function formatStatus(status) {
  const normalizedStatus = String(status).toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const { currentUser, users } = useAuth();
  const { getCampaign, toggleStatus } = useCampaigns();
  const campaign = getCampaign(campaignId);

  if (!campaign) {
    return <Navigate to="/campaigns" replace />;
  }

  const status = String(campaign.status).toLowerCase();
  const owner = users.find((user) => user.id === campaign.ownerId);
  const canManageCampaign =
    currentUser?.role === "superadmin" || campaign.ownerId === currentUser?.id;

  return (
    <div className="mx-auto min-w-0 max-w-4xl p-3 sm:p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">Campaign Details</p>
          <h1 className="max-w-full break-words text-2xl font-bold [overflow-wrap:anywhere] sm:text-3xl">
            {campaign.name}
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/campaigns"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          {canManageCampaign && (
            <>
              <Link
                to={`/campaigns/${campaign.id}/edit`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                <Edit size={18} />
                Edit
              </Link>

              <button
                type="button"
                onClick={() => toggleStatus(campaign.id)}
                className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                {status === "active" ? "Pause" : "Resume"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="min-w-0 max-w-full overflow-hidden rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6">
        <div className="min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">
              About This Campaign
            </p>
            <p className="mt-1 max-w-full whitespace-pre-wrap break-words text-gray-900 [overflow-wrap:anywhere] dark:text-slate-100">
              {campaign.description || "No campaign description provided."}
            </p>
          </div>

        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-start-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Campaign ID</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.displayId || campaign.id}
            </p>
          </div>

          {["admin", "superadmin"].includes(currentUser?.role) && (
            <div className="min-w-0 sm:col-start-2 sm:row-start-1">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Created By</p>
              <p className="mt-1 break-words text-lg font-bold text-gray-900 [overflow-wrap:anywhere] dark:text-slate-100">
                {getUserLabel(owner)}
              </p>
            </div>
          )}

          <div className="sm:col-start-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Platform</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.platform}
            </p>
          </div>

          <div className="sm:col-start-2">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Status</p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                STATUS_STYLES[status] || STATUS_STYLES.active
              }`}
            >
              {formatStatus(campaign.status)}
            </span>
          </div>

          <div className="sm:col-start-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Budget</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {formatCurrency(campaign.budget)}
            </p>
          </div>

          <div className="sm:col-start-2">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Audience</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.ageGroup}
            </p>
          </div>

          <div className="sm:col-start-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Created At</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.createdAt
                ? new Date(campaign.createdAt).toLocaleDateString()
                : "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
