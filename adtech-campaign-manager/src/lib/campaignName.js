export const CAMPAIGN_NAME_CHARACTER_LIMIT = 30;

export function getCampaignNameCharacterCount(value) {
  return value.length;
}

export function limitCampaignNameCharacters(value) {
  return value.trimStart().slice(0, CAMPAIGN_NAME_CHARACTER_LIMIT);
}
