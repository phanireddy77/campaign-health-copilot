import { Request, Response } from "express";
import { getCampaign, getLinesByCampaign } from "../servies/campaignService";
import { getCampaignHealth } from "../servies/campaignHealthService";
import { analyzeCampaign } from "../servies/campaignAnalysisService";

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

export async function getCampaignHealthDetails(req: Request, res: Response) {
    const id = Number(req.params.campaignId);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: 'INVALID_CAMPAIGN_ID',
            message: 'Invalid campaign id'
        });
    }
    const response = await getCampaignHealth(id);

    if (!response) {
        return res.status(404).json({
        error: {
            code:
            "CAMPAIGN_NOT_FOUND",

            message:
            `Campaign ${id} was not found.`,
        },
        });
    }
    
    return res.json({
        data: response
    });
}

export async function getCampaignHealthAnalysis(req: Request, res: Response) {
    const id = Number(req.params.campaignId);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: 'INVALID_CAMPAIGN_ID',
            message: 'Invalid campaign id'
        });
    }
    try {
        const result = await analyzeCampaign(id);
        if (!result) {
            return res.status(404).json({
                error: {
                code:
                    "CAMPAIGN_NOT_FOUND",

                message:
                    `Campaign ${id} was not found.`,
                },
            });
        }
        return res.json({
            data: result
        });
    } catch (error) {
        console.error("Campaign analysis failed:", error);

        res.status(502).json({
        error: {
            code:
            "AI_ANALYSIS_FAILED",

            message:
            "Campaign AI analysis could not be completed.",
        },
        });
    }
}