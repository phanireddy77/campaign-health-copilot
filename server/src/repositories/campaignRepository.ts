import db from "../db/knex";
import { Campaign, Line } from "../types/domain";

export async function getCampaignById(campaignId: number): Promise<Campaign | undefined> {
    return db<Campaign>('campaigns')
            .select('*')
            .where({ id: campaignId })
            .first();
}

export async function getLinesByCampaignId(campaignId: number): Promise<Line[]> {
    return db<Line>('lines')
           .select('*')
           .where({ campaign_id: campaignId })
           .orderBy('name', 'asc');
}