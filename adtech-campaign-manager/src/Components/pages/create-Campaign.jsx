import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { currentUser, users } = useAuth();
  const { campaigns, addCampaign } = useCampaigns();

  const [campaignName, setCampaignName] = useState("");
  const [platform, setPlatform] = useState("");
  const [budget, setBudget] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const canAssignOwner = ["admin", "superadmin"].includes(currentUser?.role);
  const assignableUsers = users.filter((user) => user.role !== "superadmin");
  const campaignNameCharacterCount = getCampaignNameCharacterCount(campaignName);
  const normalizedCampaignName = campaignName.trim().toLowerCase();
  const isDuplicateName =
    normalizedCampaignName !== "" &&
    campaigns.some(
      (campaign) =>
        String(campaign.name).trim().toLowerCase() === normalizedCampaignName
    );

  function handleSubmit(e) {
    e.preventDefault();

    if (
      campaignName.trim() === "" ||
      platform === "" ||
      ageGroup === "" ||
      (canAssignOwner && assignedUserId === "") ||
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

    const newCampaign = {
      name: campaignName.trim(),
      platform,
      budget,
      ageGroup,
      ownerId: canAssignOwner ? assignedUserId : undefined,
    };

    addCampaign(newCampaign);

    toast.success("Campaign Created Successfully!");

    navigate(canAssignOwner ? "/admin" : "/campaigns");
  }

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm text-gray-500 dark:text-slate-400">
            Audience & Budget
          </h3>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Create Campaign
          </h1>
        </div>

        <Link
          to="/campaigns"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900 sm:p-6"
      >
        {canAssignOwner && (
          <div>
            <label className="mb-2 block font-medium text-gray-900 dark:text-slate-100">
              Assign To User
            </label>

            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Select User</option>
              {assignableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  Owner {user.displayId || user.id}: {user.username} ({user.role})
                </option>
              ))}
            </select>
          </div>
        )}

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
            placeholder="Enter campaign name"
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
            placeholder="Enter budget in Rupees"
            className="number-input-no-spinner w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
             Maximum budget:{" "}
            {MAX_CAMPAIGN_BUDGET_LABEL}
          </p>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
        >
          Save Campaign
        </button>
      </form>
    </div>
  );
}
