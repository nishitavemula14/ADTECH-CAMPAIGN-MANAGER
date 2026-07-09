import { createContext, useContext } from "react";

const CampaignContext = createContext();

function useCampaigns() {
  const campaignData = useContext(CampaignContext);

  if (!campaignData) {
    throw new Error("useCampaigns must be used inside CampaignProvider");
  }

  return campaignData;
}

export { CampaignContext, useCampaigns };