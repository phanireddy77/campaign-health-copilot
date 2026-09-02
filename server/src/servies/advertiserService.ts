import { findAllAdvertisers, findAdvertiserById, findCampaignsByAdvertiser} from '../repositories/advertiserRepository';

export async function getAllAdvertiser() {
    return findAllAdvertisers();
}

export async function getAdvertiserById(advertiserId: number) {
    return findAdvertiserById(advertiserId);
}

export async function getCampaignsByAdvertiser(advertiserId: number) {
    const advertiser = await findAdvertiserById(advertiserId);

    if (!advertiser) {
        return null;
    }
    const campaigns = await findCampaignsByAdvertiser(advertiserId);

    return {
        advertiser, campaigns
    };
}