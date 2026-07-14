import { useEffect } from "react";
import { CampaignContext } from "../hooks/useCampaigns";
import { useAuth } from "../auth/useAuth.js";
import { DEFAULT_USERS } from "../data/users.js";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedCampaigns } from "../data/seed.js";

const STORAGE_KEY = "campaigns";
const DEFAULT_DEMO_CAMPAIGNS = [
  ["Summer Search Lift", "2026-07-01T09:00:00.000Z"],
  ["Creator Retargeting", "2026-07-02T10:30:00.000Z"],
  ["B2B Awareness Sprint", "2026-07-03T15:15:00.000Z"],
];

function isDefaultDemoCampaign(campaign) {
  return DEFAULT_DEMO_CAMPAIGNS.some(
    ([name, createdAt]) =>
      campaign.name === name && campaign.createdAt === createdAt
  );
}

function assignOwnerDisplayIds(campaigns) {
  const ownerCounters = {};

  return campaigns.map((campaign) => {
    const ownerKey = campaign.ownerId || "unassigned";
    ownerCounters[ownerKey] = (ownerCounters[ownerKey] || 0) + 1;

    return {
      ...campaign,
      displayId: ownerCounters[ownerKey].toString(),
    };
  });
}

export function CampaignProvider({ children }) {
  const { currentUser } = useAuth();
  const [allCampaigns, setCampaigns] = useLocalStorage(
    STORAGE_KEY,
    seedCampaigns
  );

  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.role === "admin";
  const isSuperAdmin = currentUser?.role === "superadmin";
  const canAssignCampaignOwner = isAdmin || isSuperAdmin;
  const campaigns = currentUserId
    ? isSuperAdmin
      ? allCampaigns
      : allCampaigns.filter((campaign) => campaign.ownerId === currentUserId)
    : [];

  function isOwnedCampaign(campaign) {
    return campaign.ownerId === currentUserId;
  }

  function canManageCampaign(campaign) {
    return isSuperAdmin || isOwnedCampaign(campaign);
  }

  function addCampaign(newCampaign) {
    if (!currentUserId) {
      return;
    }

    setCampaigns((prevCampaigns) => {
      const nextId =
        Math.max(
          0,
          ...prevCampaigns.map((campaign) => Number(campaign.id) || 0)
        ) + 1;

      const campaign = {
        ...newCampaign,
        id: nextId.toString(),
        ownerId:
          canAssignCampaignOwner && newCampaign.ownerId
            ? newCampaign.ownerId
            : currentUserId,
        displayId: String(
          Math.max(
            0,
            ...prevCampaigns
              .filter(
                (campaignItem) =>
                  campaignItem.ownerId ===
                  (canAssignCampaignOwner && newCampaign.ownerId
                    ? newCampaign.ownerId
                    : currentUserId)
              )
              .map((campaignItem) => Number(campaignItem.displayId) || 0)
          ) + 1
        ),
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
        campaign.id === id && canManageCampaign(campaign)
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
        (campaign) => campaign.id !== id || !canManageCampaign(campaign)
      )
    );
  }

  function deleteAllCampaigns() {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => !canManageCampaign(campaign))
    );
  }

  function toggleStatus(id) {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign.id === id && canManageCampaign(campaign)
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
    if (
      allCampaigns.length === 0 ||
      allCampaigns.every((campaign) => campaign.displayId)
    ) {
      return;
    }

    setCampaigns((prevCampaigns) => assignOwnerDisplayIds(prevCampaigns));
  }, [allCampaigns, setCampaigns]);

  useEffect(() => {
    if (!allCampaigns.some(isDefaultDemoCampaign)) {
      return;
    }

    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => !isDefaultDemoCampaign(campaign))
    );
  }, [allCampaigns, setCampaigns]);

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
        allCampaigns,
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
