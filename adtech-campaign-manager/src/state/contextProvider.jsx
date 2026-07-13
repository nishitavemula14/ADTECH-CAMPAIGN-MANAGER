import { CampaignContext } from "../hooks/useCampaigns";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "campaigns";

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useLocalStorage(STORAGE_KEY, seedCampaigns);

  function addCampaign(newCampaign) {
    setCampaigns((prevCampaigns) => {
      const nextId =
        Math.max(
          0,
          ...prevCampaigns.map((campaign) => Number(campaign.id) || 0)
        ) + 1;

      const campaign = {
        ...newCampaign,
        id: nextId.toString(),
        status: newCampaign.status || "active",
        budget: Number(newCampaign.budget),
        createdAt: new Date().toISOString(),
      };

      return [...prevCampaigns, campaign];
    });
  }

  function updateCampaign(id, updatedCampaign) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              ...updatedCampaign,
              budget:
                updatedCampaign.budget === undefined
                  ? campaign.budget
                  : Number(updatedCampaign.budget),
              updatedAt: new Date().toISOString(),
            }
          : campaign
      )
    );
  }

  function deleteCampaign(id) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => campaign.id !== id)
    );
  }

  function toggleStatus(id) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status:
                String(campaign.status).toLowerCase() === "active"
                  ? "paused"
                  : "active",
            }
          : campaign
      )
    );
  }

  function getCampaign(id) {
    return campaigns.find((campaign) => campaign.id === id);
  }

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        toggleStatus,
        getCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
