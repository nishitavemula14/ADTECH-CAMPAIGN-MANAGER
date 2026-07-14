import { CampaignContext } from "../hooks/useCampaigns.js";
import { useAuth } from "../auth/useAuth.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "campaigns";

export function CampaignProvider({ children }) {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id;
  const [campaigns, setCampaigns] = useLocalStorage(
    STORAGE_KEY,
    seedCampaigns
  );


  const addCampaign = (newCampaign) => {
    setCampaigns((prevCampaigns) => {
      const nextId =
        Math.max(
          0,
          ...prevCampaigns.map((campaign) => Number(campaign.id) || 0)
        ) + 1;

      const campaign = {
        ...newCampaign,
        id: nextId.toString(),
        createdAt: new Date().toISOString(),
        status: "active",
        budget: Number(newCampaign.budget),
      };

      return [...prevCampaigns, campaign];
    });
  };

 
  const deleteCampaign = (id) => {
    const updatedCampaigns = campaigns.filter(
      (campaign) => campaign.id !== id
    );

    setCampaigns(updatedCampaigns);
  };

  const deleteAllCampaigns = () => {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => campaign.ownerId !== currentUserId)
    );
  };

  
  const updateCampaign = (id, updatedData) => {
    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === id) {
        return {
          ...campaign,
          ...updatedData,
          budget: Number(updatedData.budget),
          updatedAt: new Date().toISOString(),
        };
      }

      return campaign;
    });

    setCampaigns(updatedCampaigns);
  };

 
  const toggleStatus = (id) => {
    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status:
            String(campaign.status).toLowerCase() === "active"
              ? "paused"
              : "active",
        };
      }

      return campaign;
    });

    setCampaigns(updatedCampaigns);
  };

  
  const getCampaign = (id) => {
    return campaigns.find((campaign) => campaign.id === id);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        addCampaign,
        deleteCampaign,
        deleteAllCampaigns,
        updateCampaign,
        toggleStatus,
        getCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
