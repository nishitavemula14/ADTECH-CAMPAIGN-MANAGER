import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns.js";

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

  function handleSubmit(event) {
    event.preventDefault();

    if (
      campaignName.trim() === "" ||
      platform === "" ||
      ageGroup === "" ||
      budget === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    updateCampaign(campaignId, {
      name: campaignName,
      platform,
      ageGroup,
      budget,
      status,
    });

    alert("Campaign Updated Successfully!");

    navigate(`/campaigns/${campaignId}`);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Audience & Budget
          </p>

          <h1 className="text-3xl font-bold">
            Edit Campaign
          </h1>
        </div>

        <Link
          to={`/campaigns/${campaignId}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg bg-white p-6 shadow-lg"
      >
        <div>
          <label className="mb-2 block font-medium">
            Campaign Name
          </label>

          <input
            type="text"
            value={campaignName}
            onChange={(e) =>
              setCampaignName(e.target.value)
            }
            className="w-full rounded-md border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">
            Platform
          </label>

          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value)
            }
            className="w-full rounded-md border p-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Platform</option>
            <option>Google Ads</option>
            <option>Facebook</option>
            <option>Instagram</option>
            <option>LinkedIn</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Audience
          </label>

          <select
            value={ageGroup}
            onChange={(e) =>
              setAgeGroup(e.target.value)
            }
            className="w-full rounded-md border p-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Audience</option>
            <option>18-24</option>
            <option>25-34</option>
            <option>35-44</option>
            <option>45+</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block font-medium">
            Budget
          </label>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value.replace(/\D/g, ""))
            }
            className="w-full rounded-md border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-md border p-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="active">
              Active
            </option>

            <option value="paused">
              Paused
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Update Campaign
        </button>
      </form>
    </div>
  );
}
