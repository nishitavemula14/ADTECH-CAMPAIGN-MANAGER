import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns.js";

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
  const { getCampaign } = useCampaigns();
  const campaign = getCampaign(campaignId);

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Campaign Not Found</h1>
        <Link
          to="/campaigns"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const status = String(campaign.status).toLowerCase();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Campaign Details</p>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/campaigns"
            className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
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
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-500">Campaign ID</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {campaign.id}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Status</p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                STATUS_STYLES[status] || STATUS_STYLES.active
              }`}
            >
              {formatStatus(campaign.status)}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Platform</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {campaign.platform}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Audience</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {campaign.ageGroup}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Budget</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(campaign.budget)}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Created At</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
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
