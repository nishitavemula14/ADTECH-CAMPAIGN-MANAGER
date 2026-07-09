import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function EditCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();


  const [campaignName, setCampaignName] = useState("Summer Sale Campaign");
  const [platform, setPlatform] = useState("Google Ads");
  const [budget, setBudget] = useState(50000);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!campaignName || !platform || !budget) {
      alert("Please fill all the fields");
      return;
    }


    console.log({
      id: campaignId,
      campaignName,
      platform,
      budget,
    });

    alert("Campaign Updated Successfully!");

    navigate(`/campaigns/${campaignId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <div>
          <p className="text-gray-500 text-sm">
            Audience & Budget
          </p>

          <h1 className="text-3xl font-bold">
            Edit Campaign
          </h1>
        </div>

        <Link
          to={`/campaigns/${campaignId}`}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            Campaign Name
          </label>

          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full border rounded-md p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Platform
          </label>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border rounded-md p-3"
          >
            <option>Google Ads</option>
            <option>Facebook</option>
            <option>Instagram</option>
            <option>LinkedIn</option>
          </select>
        </div>


        <div>
          <label className="block mb-2 font-medium">
            Budget
          </label>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border rounded-md p-3"
          />
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Update Campaign
        </button>

      </form>

    </div>
  );
}

