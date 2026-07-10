import { useState, useEffect } from "react";
import { CampaignContext } from "../hooks/useCampaigns";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "campaigns";

export function CampaignProvider({ children }) {

  const [campaigns, setCampaigns] = useState(() => {
    try {
      const storedCampaigns = localStorage.getItem(STORAGE_KEY);

      if (storedCampaigns) {
        return JSON.parse(storedCampaigns);
      }

      return seedCampaigns;
    } catch {
      return seedCampaigns;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

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
      };

      return [...prevCampaigns, campaign];
    });
  }

  function updateCampaign(id, updatedCampaign) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, ...updatedCampaign }
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
