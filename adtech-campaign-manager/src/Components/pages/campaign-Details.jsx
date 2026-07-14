import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns.js";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

function formatCurrency(value) {
  return `\u20B9${Number(value).toLocaleString()}`;
}

function formatStatus(status) {
  const normalizedStatus = String(status).toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const { getCampaign, toggleStatus } = useCampaigns();
  const campaign = getCampaign(campaignId);

  if (!campaign) {
    return <Navigate to="/campaigns" replace />;
  }

  const status = String(campaign.status).toLowerCase();

  return (
    <div className="mx-auto max-w-4xl p-3 sm:p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">Campaign Details</p>
          <h1 className="break-words text-2xl font-bold sm:text-3xl">{campaign.name}</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/campaigns"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

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
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Campaign ID</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.id}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Status</p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                STATUS_STYLES[status] || STATUS_STYLES.active
              }`}
            >
              {formatStatus(campaign.status)}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Platform</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.platform}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Audience</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {campaign.ageGroup}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Budget</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">
              {formatCurrency(campaign.budget)}
            </p>
          </div>

          <div>
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
