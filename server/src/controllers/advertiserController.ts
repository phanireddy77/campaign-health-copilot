import { Request, Response } from "express";
import { getAllAdvertiser, getAdvertiserById, getCampaignsByAdvertiser } from "../servies/advertiserService";

export async function listAdvertisers(req: Request, res: Response) {
    const advertisers = await getAllAdvertiser();
    return res.json({ data: advertisers });
}

export async function getAdvertiser(req: Request, res: Response) {
   const advId = Number(req.params.advertiserId);

    if (!Number.isInteger(advId)) {
        return res.status(400).json({
            error: 'INVALID_ADVERTISER_ID',
            message: 'Invalid advertiser id'
        });
    }
    const advertiser = await getAdvertiserById(Number(advId));

    if (!advertiser) {
        return res.status(404).json({
            error: 'ADVERTISER_NOT_FOUND',
            message: 'Advertiser not found'
        });
    }
    return res.json({
        data: advertiser
    });
}

export async function listCampaignsByAdvertiser(req: Request, res: Response) {
   const advId = Number(req.params.advertiserId);

    if (!Number.isInteger(advId)) {
        return res.status(400).json({
            error: 'INVALID_ADVERTISER_ID',
            message: 'Invalid advertiser id'
        });
    }
    const result = await getCampaignsByAdvertiser(Number(advId));

    if (!result) {
        return res.status(404).json({
            error: 'ADVERTISER_NOT_FOUND',
            message: 'Advertiser not found'
        });
    }

    return res.json({
        data: result
    });
}