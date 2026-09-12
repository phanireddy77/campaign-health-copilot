import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { getCampaign, getLinesByCampaign } from "../servies/campaignService";
import { getCampaignHealth } from "../servies/campaignHealthService";
import { analyzeCampaign } from "../servies/campaignAnalysisService";

export async function getCampaignDetails(req: Request, res: Response) {
    const id = Number(req.params.campaignId);
    const campaign = await getCampaign(id);

    if (!campaign) {
        throw new AppError(404, "CAMPAIGN_NOT_FOUND", `Campaign ${id} not found`);
    }
    return res.json({
        data: campaign
    });
}

export async function listLinesByCampaign(req: Request, res: Response) {
    const id = Number(req.params.campaignId);
    const response = await getLinesByCampaign(id);

    if (!response) {
        throw new AppError(404, "CAMPAIGN_NOT_FOUND", `Campaign ${id} not found`);
    }
    return res.json({
        data: response
    });
}

export async function getCampaignHealthDetails(req: Request, res: Response) {
    const id = Number(req.params.campaignId);
    const response = await getCampaignHealth(id);

    if (!response) {
        throw new AppError(404, "CAMPAIGN_NOT_FOUND", `Campaign ${id} not found`);
    }
    
    return res.json({
        data: response
    });
}

export async function getCampaignHealthAnalysis(req: Request, res: Response) {
    const id = Number(req.params.campaignId);

    try {
            const result = await analyzeCampaign(id);
            if (!result) {
                throw new AppError(404, "CAMPAIGN_NOT_FOUND", `Campaign ${id} not found`);
            }
            return res.json({
                data: result
            });
        } catch (error) {
            console.error(
                "Campaign analysis failed:",
                error
            );

            if (
                error instanceof Error &&
                error.message.includes(
                "OPENAI_API_KEY"
                )
            ) {
                throw new AppError(503, "AI_NOT_CONFIGURED", "AI analysis is not configured.");
            }

            throw new AppError(502, "AI_ANALYSIS_FAILED", "Campaign AI analysis could not be completed. Please try again.");
        }
}