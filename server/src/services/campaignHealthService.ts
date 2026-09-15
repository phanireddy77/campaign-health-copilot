import {
  getCampaignById,
  getLinesByCampaignId,
} from "../repositories/campaignRepository.js";

import {
  findMetricsByLineId,
} from "../repositories/lineRepository.js";

import {
  calculateLinePerformance,
} from "./lineMetricService.js";

import {
  evaluateLineHealth,
} from "./lineHealthEngine.js";

import {
  calculateCampaignHealth,
} from "./campaignHealthEngine.js";

export async function getCampaignHealth(campaignId: number) {
    const campaign = await getCampaignById(campaignId);

    if(!campaign) {
        return null;
    }

    const lines = await getLinesByCampaignId(campaignId);

    if (!lines.length) {
        return null;
    }

    const lineHealthInputs = await Promise.all(
        lines.map( async(line) => {
            const metrics = await findMetricsByLineId(line.id);
            const performance = await findMetricsByLineId(line.id);
            const performanceSummary = calculateLinePerformance(line, metrics);
            const healthMetrics = evaluateLineHealth(line, performanceSummary);

            return {
                lineId: line.id,
                lineName: line.name,
                score: healthMetrics.score,
                status: healthMetrics.status,
                spend: performanceSummary.spend,
                budget: performanceSummary.budget,
                issues:
                    healthMetrics.issues.map(
                    (issue) =>
                        issue.code
                    )
            };
        })
    )

    const health = calculateCampaignHealth({ campaignId: campaign.id, lines: lineHealthInputs});

    return {
        campaign,
        health
    };
}