import { Request, Response } from "express";
import { getCampaign, getLinesByCampaign } from "../servies/campaignService";

export async function getCampaignDetails(req: Request, res: Response) {
    const id = Number(req.params.campaignId);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: 'INVALID_CAMPAIGN_ID',
            message: 'Invalid campaign id'
        });
    }
    const campaign = await getCampaign(id);

    return res.json({
        data: campaign
    });
}

export async function listLinesByCampaign(req: Request, res: Response) {
    const id = Number(req.params.campaignId);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: 'INVALID_CAMPAIGN_ID',
            message: 'Invalid campaign id'
        });
    }

    const response = await getLinesByCampaign(id);

    return res.json({
        data: response
    });
}