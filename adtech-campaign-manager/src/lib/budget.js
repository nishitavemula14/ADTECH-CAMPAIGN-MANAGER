export const MAX_CAMPAIGN_BUDGET = 100000000;
export const MAX_CAMPAIGN_BUDGET_LABEL = "10 crore";

export function limitCampaignBudget(value) {
  const digits = value.replace(/\D/g, "");

  if (digits === "") {
    return "";
  }

  return Math.min(Number(digits), MAX_CAMPAIGN_BUDGET).toString();
}
