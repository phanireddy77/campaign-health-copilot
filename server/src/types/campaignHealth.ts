import type { HealthIssueCode, HealthStatus } from "./lineHealth";

export interface CampaignLineHealth {
  lineId: number;
  lineName: string;
  score: number;
  status: HealthStatus;
  spend: number;
  budget: number;
  weight: number;
  riskContribution: number;
  issues: HealthIssueCode[];
}

export interface CampaignHealthResult {
  campaignId: number;
  score: number;
  status: HealthStatus;
  totalSpend: number;
  totalLineBudget: number;
  criticalExposure: number;
  warningExposure: number;
  healthyExposure: number;
  lines: CampaignLineHealth[];
}