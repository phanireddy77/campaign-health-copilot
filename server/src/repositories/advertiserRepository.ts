import db from "../db/knex";
import { Advertiser, Campaign } from "../types/domain";

export async function findAllAdvertisers(): Promise<Advertiser[]> {
    return db<Advertiser>('advertisers')
            .select('*')
            .orderBy('name', 'asc');
}

export async function findAdvertiserById(advertiserId: number): Promise<Advertiser | undefined> {
    return db<Advertiser>('advertisers')
            .select('*')
            .where({ id: advertiserId })
            .first();
    }

export async function findCampaignsByAdvertiser(advertiserId: number): Promise<Campaign[]> {
    return db<Campaign>('campaigns')
            .select('*')
            .where({ advertiser_id: advertiserId})
            .orderBy('name', 'asc');
}