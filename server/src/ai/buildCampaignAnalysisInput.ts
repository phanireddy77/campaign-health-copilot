import type {
  Campaign,
} from "../types/domain.js";

import type {
  CampaignHealthResult,
} from "../types/campaignHealth.js";

interface BuildInputParams {
  campaign: Campaign;

  health: CampaignHealthResult;
}

export function buildCampaignAnalysisInput({
  campaign,
  health,
}: BuildInputParams) {
  return {
    campaign: {
      id: campaign.id,

      name: campaign.name,

      status:
        campaign.status,

      budget:
        Number(campaign.budget),

      startDate:
        campaign.start_date,

      endDate:
        campaign.end_date,
    },

    campaignHealth: {
      score:
        health.score,

      status:
        health.status,

      totalSpend:
        health.totalSpend,

      criticalExposure:
        health.criticalExposure,

      warningExposure:
        health.warningExposure,

      healthyExposure:
        health.healthyExposure,
    },

    lines:
      health.lines.map(
        (line) => ({
          lineId:
            line.lineId,

          lineName:
            line.lineName,

          status:
            line.status,

          healthScore:
            line.score,

          spend:
            line.spend,

          spendWeight:
            line.weight,

          riskContribution:
            line.riskContribution,

          issues:
            line.issues,
        })
      ),
  };
}