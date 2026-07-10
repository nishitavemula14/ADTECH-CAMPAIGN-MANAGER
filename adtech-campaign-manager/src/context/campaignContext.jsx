import { useEffect, useState } from "react";
import { CampaignContext } from "../hooks/useCampaigns.js";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "adtech_campaigns";

export function CampaignProvider({ children }) {
  
  const [campaigns, setCampaigns] = useState(() => {
    const savedCampaigns = localStorage.getItem(STORAGE_KEY);

    if (savedCampaigns) {
      return JSON.parse(savedCampaigns);
    }

    return seedCampaigns;
  });

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);


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
        updateCampaign,
        toggleStatus,
        getCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
