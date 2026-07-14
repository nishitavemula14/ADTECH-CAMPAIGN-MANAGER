import { useEffect } from "react";
import { CampaignContext } from "../hooks/useCampaigns";
import { DEFAULT_USERS, useAuth } from "../auth/auth.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "campaigns";

export function CampaignProvider({ children }) {
  const { currentUser } = useAuth();
  const [allCampaigns, setCampaigns] = useLocalStorage(
    STORAGE_KEY,
    seedCampaigns
  );

  const currentUserId = currentUser?.id;
  const campaigns = currentUserId
    ? allCampaigns.filter((campaign) => campaign.ownerId === currentUserId)
    : [];

  function isOwnedCampaign(campaign) {
    return campaign.ownerId === currentUserId;
  }

  function addCampaign(newCampaign) {
    if (!currentUserId) {
      return;
    }

    setCampaigns((prevCampaigns) => {
      const ownedCampaigns = prevCampaigns.filter(
        (campaign) => campaign.ownerId === currentUserId
      );
      const nextId =
        Math.max(
          0,
          ...ownedCampaigns.map((campaign) => Number(campaign.id) || 0)
        ) + 1;

      const campaign = {
        ...newCampaign,
        id: nextId.toString(),
        ownerId: currentUserId,
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
        campaign.id === id && isOwnedCampaign(campaign)
          ? {
              ...campaign,
              ...updatedCampaign,
              ownerId: campaign.ownerId,
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
      prevCampaigns.filter(
        (campaign) => campaign.id !== id || !isOwnedCampaign(campaign)
      )
    );
  }

  function deleteAllCampaigns() {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => !isOwnedCampaign(campaign))
    );
  }

  function toggleStatus(id) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === id && isOwnedCampaign(campaign)
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

  useEffect(() => {
    if (!allCampaigns.some((campaign) => !campaign.ownerId)) {
      return;
    }

    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign, index) =>
        campaign.ownerId
          ? campaign
          : {
              ...campaign,
              ownerId: DEFAULT_USERS[index % DEFAULT_USERS.length].id,
            }
      )
    );
  }, [allCampaigns, setCampaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        deleteAllCampaigns,
        toggleStatus,
        getCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
