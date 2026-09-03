import { getCampaignById, getLinesByCampaignId } from "../repositories/campaignRepository";

export async function getCampaign(id: number) {
    return getCampaignById(id);
}

export async function getLinesByCampaign(campaignId: number) {
    const campaign = await getCampaignById(campaignId);

    if(!campaign) {
        return null;
    }
    const lines = await getLinesByCampaignId(campaignId);

    return {
        campaign, lines
    };
}