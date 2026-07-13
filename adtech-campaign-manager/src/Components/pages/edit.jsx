import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import {
  CAMPAIGN_NAME_CHARACTER_LIMIT,
  getCampaignNameCharacterCount,
  limitCampaignNameCharacters,
} from "../../lib/campaignName.js";
import {
  MAX_CAMPAIGN_BUDGET,
  MAX_CAMPAIGN_BUDGET_LABEL,
  limitCampaignBudget,
} from "../../lib/budget.js";

export default function EditCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const { campaigns, updateCampaign } = useCampaigns();

  const campaign = campaigns.find(
    (item) => item.id === campaignId
  );

  const [campaignName, setCampaignName] = useState(campaign?.name || "");
  const [platform, setPlatform] = useState(campaign?.platform || "");
  const [ageGroup, setAgeGroup] = useState(campaign?.ageGroup || "");
  const [budget, setBudget] = useState(campaign?.budget || "");
  const [status, setStatus] = useState(campaign?.status || "active");
  const campaignNameCharacterCount = getCampaignNameCharacterCount(campaignName);
  const normalizedCampaignName = campaignName.trim().toLowerCase();
  const isDuplicateName =
    normalizedCampaignName !== "" &&
    campaigns.some(
      (item) =>
        item.id !== campaignId &&
        String(item.name).trim().toLowerCase() === normalizedCampaignName
    );

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">
          Campaign Not Found
        </h1>

        <Link
          to="/campaigns"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Campaigns
        </Link>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      campaignName.trim() === "" ||
      platform === "" ||
      ageGroup === "" ||
      Number(budget) <= 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (Number(budget) > MAX_CAMPAIGN_BUDGET) {
      toast.error(`Budget cannot be more than ${MAX_CAMPAIGN_BUDGET_LABEL}`);
      return;
    }

    if (campaignName.trim().length > CAMPAIGN_NAME_CHARACTER_LIMIT) {
      toast.error("Campaign name must be 30 characters or less");
      return;
    }

    if (isDuplicateName) {
      toast.error("Campaign name already exists");
      return;
    }

    updateCampaign(campaignId, {
      name: campaignName.trim(),
      platform: platform,
      ageGroup: ageGroup,
      budget: budget,
      status: status,
    });

    toast.success("Campaign Updated Successfully!");

    navigate(`/campaigns/${campaignId}`);
  }

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Audience & Budget
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Edit Campaign
          </h1>
        </div>

        <Link
          to={`/campaigns/${campaignId}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900 sm:p-6"
      >
        
        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Campaign Name
          </label>

          <input
            type="text"
            value={campaignName}
            maxLength={CAMPAIGN_NAME_CHARACTER_LIMIT}
            onChange={(e) =>
              setCampaignName(limitCampaignNameCharacters(e.target.value))
            }
            className={`w-full rounded-md border p-3 focus:outline-none ${
              isDuplicateName
                ? "border-red-500 bg-red-50 text-red-700 focus:border-red-500 dark:bg-red-950/40 dark:text-red-200"
                : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            }`}
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {campaignNameCharacterCount}/{CAMPAIGN_NAME_CHARACTER_LIMIT} characters
          </p>

          {isDuplicateName && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              This name already exists.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Platform
          </label>

          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value)
            }
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="">Select Platform</option>
            <option>Google Ads</option>
            <option>Facebook</option>
            <option>Instagram</option>
            <option>LinkedIn</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Audience
          </label>

          <select
            value={ageGroup}
            onChange={(e) =>
              setAgeGroup(e.target.value)
            }
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="">Select Audience</option>
            <option>18-24</option>
            <option>25-34</option>
            <option>35-44</option>
            <option>45+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Budget
          </label>

          <input
            type="number"
            min="1"
            max={MAX_CAMPAIGN_BUDGET}
            value={budget}
            onChange={(e) =>
              setBudget(
                limitCampaignBudget(e.target.value)
              )
            }
            className="number-input-no-spinner w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Maximum budget: {MAX_CAMPAIGN_BUDGET_LABEL}
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Update Campaign
        </button>
      </form>
    </div>
  );
}
