import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateCampaignHealth,
} from "../campaignHealthEngine.js";

describe("campaignHealthEngine Tests", () => {
  it(
  "calculates spend-weighted campaign health",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "A",

            score: 100,
            status: "HEALTHY",

            spend: 40000,
            budget: 50000,

            issues: [],
          },

          {
            lineId: 2,
            lineName: "B",

            score: 60,
            status: "WARNING",

            spend: 5000,
            budget: 50000,

            issues: [
              "UNDER_PACING",
            ],
          },

          {
            lineId: 3,
            lineName: "C",

            score: 80,
            status: "WARNING",

            spend: 20000,
            budget: 50000,

            issues: [
              "HIGH_CPA",
            ],
          },
        ],
      });

    expect(
      result.score
    ).toBe(91);
  }
);

it(
  "normalizes spend weights to one",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "A",
            score: 100,
            status: "HEALTHY",
            spend: 75,
            budget: 100,
            issues: [],
          },

          {
            lineId: 2,
            lineName: "B",
            score: 80,
            status: "WARNING",
            spend: 25,
            budget: 100,
            issues: [
              "LOW_CTR",
            ],
          },
        ],
      });

    const totalWeight =
      result.lines.reduce(
        (sum, line) =>
          sum + line.weight,
        0
      );

    expect(
      totalWeight
    ).toBeCloseTo(1);
  }
);

it(
  "uses budget weighting when all lines have zero spend",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "Large Line",

            score: 100,
            status: "HEALTHY",

            spend: 0,
            budget: 900,

            issues: [],
          },

          {
            lineId: 2,
            lineName: "Small Line",

            score: 60,
            status: "WARNING",

            spend: 0,
            budget: 100,

            issues: [
              "UNDER_PACING",
            ],
          },
        ],
      });

    expect(
      result.lines[0]
        .weight +
      result.lines[1]
        .weight
    ).toBeCloseTo(1);

    expect(
      result.score
    ).toBe(96);
  }
);

it(
  "marks campaign CRITICAL when critical exposure reaches threshold",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "Healthy",

            score: 100,
            status: "HEALTHY",

            spend: 750,
            budget: 750,

            issues: [],
          },

          {
            lineId: 2,
            lineName: "Critical",

            score: 60,
            status: "CRITICAL",

            spend: 250,
            budget: 250,

            issues: [
              "NO_CONVERSIONS",
            ],
          },
        ],
      });

    expect(
      result.criticalExposure
    ).toBeCloseTo(
      0.25
    );

    expect(
      result.status
    ).toBe(
      "CRITICAL"
    );
  }
);

it(
  "does not mark campaign healthy when critical exposure exists",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "Healthy",

            score: 100,
            status: "HEALTHY",

            spend: 950,
            budget: 950,

            issues: [],
          },

          {
            lineId: 2,
            lineName: "Critical",

            score: 60,
            status: "CRITICAL",

            spend: 50,
            budget: 50,

            issues: [
              "NO_CONVERSIONS",
            ],
          },
        ],
      });

    expect(
      result.score
    ).toBe(98);

    expect(
      result.status
    ).toBe(
      "WARNING"
    );
  }
);

it(
  "ranks lines by contribution to campaign risk",
  () => {
    const result =
      calculateCampaignHealth({
        campaignId: 1,

        lines: [
          {
            lineId: 1,
            lineName: "A",

            score: 100,
            status: "HEALTHY",

            spend: 50,
            budget: 50,

            issues: [],
          },

          {
            lineId: 2,
            lineName: "B",

            score: 80,
            status: "WARNING",

            spend: 30,
            budget: 30,

            issues: [
              "LOW_CTR",
            ],
          },

          {
            lineId: 3,
            lineName: "C",

            score: 40,
            status: "CRITICAL",

            spend: 20,
            budget: 20,

            issues: [
              "NO_CONVERSIONS",
            ],
          },
        ],
      });

    expect(
      result.lines[0]
        .lineId
    ).toBe(3);

    expect(
      result.lines[0]
        .riskContribution
    ).toBeCloseTo(
      2 / 3
    );

    expect(
      result.lines[1]
        .riskContribution
    ).toBeCloseTo(
      1 / 3
    );

    expect(
      result.lines[2]
        .riskContribution
    ).toBe(0);
  });
});
