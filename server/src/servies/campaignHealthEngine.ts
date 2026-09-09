import {
  CAMPAIGN_HEALTH_THRESHOLDS,
} from "../config/campaignHealthThresholds";

import type {
  CampaignHealthResult,
  CampaignLineHealth,
} from "../types/campaignHealth.js";

import type {
  HealthStatus,
} from "../types/lineHealth";

interface CampaignHealthInput {
  campaignId: number;

  lines: Array<{
    lineId: number;
    lineName: string;

    score: number;
    status: HealthStatus;

    spend: number;
    budget: number;

    issues: CampaignLineHealth["issues"];
  }>;
}

export function calculateCampaignHealth(
  input: CampaignHealthInput
): CampaignHealthResult {
  const totalSpend =
    input.lines.reduce(
      (total, line) =>
        total + line.spend,
      0
    );

  const totalLineBudget =
    input.lines.reduce(
      (total, line) =>
        total + line.budget,
      0
    );

  const useSpendWeights =
    totalSpend > 0;

  const denominator =
    useSpendWeights
      ? totalSpend
      : totalLineBudget;

  const weightedLines =
    input.lines.map(
      (line): CampaignLineHealth => {
        const basis =
          useSpendWeights
            ? line.spend
            : line.budget;

        const weight =
          denominator > 0
            ? basis / denominator
            : 0;

        return {
          ...line,

          weight,

          riskContribution: 0,
        };
      }
    );

  const weightedScore =
    weightedLines.reduce(
      (total, line) =>
        total +
        line.score * line.weight,
      0
    );

  const score =
    weightedLines.length === 0
      ? 100
      : Math.round(weightedScore);

  const criticalExposure =
    calculateExposure(
      weightedLines,
      "CRITICAL"
    );

  const warningExposure =
    calculateExposure(
      weightedLines,
      "WARNING"
    );

  const healthyExposure =
    calculateExposure(
      weightedLines,
      "HEALTHY"
    );

  const totalRisk =
    weightedLines.reduce(
      (total, line) =>
        total +
        line.weight *
          (100 - line.score),
      0
    );

  const linesWithRisk =
    weightedLines.map((line) => {
      const weightedRisk =
        line.weight *
        (100 - line.score);

      return {
        ...line,

        riskContribution:
          totalRisk > 0
            ? weightedRisk / totalRisk
            : 0,
      };
    });

  const status =
    determineCampaignStatus(
      score,
      criticalExposure,
      warningExposure
    );

  linesWithRisk.sort(
    (a, b) =>
      b.riskContribution -
      a.riskContribution
  );

  return {
    campaignId:
      input.campaignId,

    score,

    status,

    totalSpend,

    totalLineBudget,

    criticalExposure,

    warningExposure,

    healthyExposure,

    lines:
      linesWithRisk,
  };
}

function calculateExposure(
  lines: CampaignLineHealth[],
  status: HealthStatus
): number {
  return lines
    .filter(
      (line) =>
        line.status === status
    )
    .reduce(
      (total, line) =>
        total + line.weight,
      0
    );
}

function determineCampaignStatus(
  score: number,
  criticalExposure: number,
  warningExposure: number
): HealthStatus {
  if (
    score <
    CAMPAIGN_HEALTH_THRESHOLDS
      .warningScore
  ) {
    return "CRITICAL";
  }

  if (
    criticalExposure >=
    CAMPAIGN_HEALTH_THRESHOLDS
      .criticalExposure
  ) {
    return "CRITICAL";
  }

  if (
    criticalExposure > 0
  ) {
    return "WARNING";
  }

  if (
    score <
    CAMPAIGN_HEALTH_THRESHOLDS
      .healthyScore
  ) {
    return "WARNING";
  }

  if (
    warningExposure > 0
  ) {
    return "WARNING";
  }

  return "HEALTHY";
}