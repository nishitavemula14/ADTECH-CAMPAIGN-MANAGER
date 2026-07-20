import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/useAuth.js";
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

const CAMPAIGN_DESCRIPTION_CHARACTER_LIMIT = 300;

export default function EditCampaign() {
  const { campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const { campaigns, updateCampaign } = useCampaigns();
  const activeNav = location.state?.activeNav;
  const returnPath =
    activeNav === "super-admin"
      ? "/super-admin"
      : activeNav === "admin"
        ? "/admin-monitor"
        : "/campaigns";

  const campaign = campaigns.find(
    (item) => item.id === campaignId
  );

  const [campaignName, setCampaignName] = useState(campaign?.name || "");
  const [description, setDescription] = useState(campaign?.description || "");
  const [platform, setPlatform] = useState(campaign?.platform || "");
  const [ageGroup, setAgeGroup] = useState(campaign?.ageGroup || "");
  const [budget, setBudget] = useState(campaign?.budget || "");
  const [status, setStatus] = useState(campaign?.status || "active");
  const campaignNameCharacterCount = getCampaignNameCharacterCount(campaignName);
  const hasChanges =
    campaignName.trim() !== String(campaign?.name || "").trim() ||
    description.trim() !== String(campaign?.description || "").trim() ||
    platform !== (campaign?.platform || "") ||
    ageGroup !== (campaign?.ageGroup || "") ||
    String(budget) !== String(campaign?.budget || "") ||
    status !== (campaign?.status || "active");
  const normalizedCampaignName = campaignName.trim().toLowerCase();
  const isDuplicateName =
    normalizedCampaignName !== "" &&
    campaigns.some(
      (item) =>
        item.id !== campaignId &&
        String(item.name).trim().toLowerCase() === normalizedCampaignName
    );

  if (!campaign) {
    return <Navigate to="/campaigns" replace />;
  }

  const canManageCampaign =
    currentUser?.role === "superadmin" || campaign.ownerId === currentUser?.id;

  if (!canManageCampaign) {
    return <Navigate to={`/campaigns/${campaignId}`} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      campaignName.trim() === "" ||
      description.trim() === "" ||
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

    if (!hasChanges) {
      navigate(returnPath, { state: location.state });
      return;
    }

    updateCampaign(campaignId, {
      name: campaignName.trim(),
      description: description.trim(),
      platform: platform,
      ageGroup: ageGroup,
      budget: budget,
      status: status,
    });

    toast.success("Campaign Updated Successfully!");

    navigate(returnPath, { state: location.state });
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
          state={location.state}
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
          <label
            htmlFor="campaign-description"
            className="mb-2 block font-medium text-gray-900 dark:text-slate-100"
          >
            What is your campaign about?
          </label>

          <textarea
            id="campaign-description"
            value={description}
            maxLength={CAMPAIGN_DESCRIPTION_CHARACTER_LIMIT}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your campaign, its goal, or the product you are promoting"
            rows={4}
            required
            className="w-full resize-y rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {description.length}/{CAMPAIGN_DESCRIPTION_CHARACTER_LIMIT} characters
          </p>
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
            Budget ({"\u20B9"})
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
             Maximum Limit:{" "}
            {MAX_CAMPAIGN_BUDGET_LABEL}
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
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={returnPath}
            state={location.state}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-1/2"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 sm:w-1/2"
          >
            Update Campaign
          </button>
        </div>
      </form>
    </div>
  );
}
