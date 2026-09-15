import { describe, it, expect } from "vitest";
import { Line, LineMetric, LinePerformanceSummary }  from "../../types/domain";
import { evaluateLineHealth } from "../lineHealthEngine";

const line: Line = {
  id: 1,
  campaign_id: 1,
  name: "Test Line",
  status: "ACTIVE",
  budget: "60000",
  daily_budget: "1000",
  goal_type: "CPA",
  goal_value: "40",
  start_date: "2026-08-01",
  end_date: "2026-09-30",
  created_at: new Date(),
  updated_at: new Date()
};

const healthyPerformance:LinePerformanceSummary = {
    asOfDate: "2026-08-29",
    spend: 28500,
    impressions: 2000000,
    clicks: 16000,
    conversions: 800,
    revenue: 50000,
    ctr: 0.008,
    cpc: 1.78125,
    cpa: 35.625,
    roas: 1.75,
    budget: 60000,
    budgetUtilization: 0.475,
    expectedSpend: 28524,
    pacingRatio: 0.999,
    elapsedFlightPercentage: 0.4754
  };

  describe("lineHealthService - Tests", () => {

    it("Line performance - Healthy", () => {
        const lineHealth = evaluateLineHealth(line, healthyPerformance);

        expect(lineHealth.issues.length).toBe(0);
        expect(lineHealth.score).toBe(100);
        expect(lineHealth.status).toBe("HEALTHY");
    });

    it("detects under pacing", () => {
        const performanceSummary = { ...healthyPerformance, pacingRatio: 0.5 };
        const result = evaluateLineHealth(line, performanceSummary);

        expect(result.issues.map((issue) => issue.code)).toContain("UNDER_PACING");
        expect(result.score).toBe(80);
        expect(result.status).toBe("WARNING");
    });

    it("detects over pacing", () => {
        const performanceSummary = { ...healthyPerformance, pacingRatio: 1.5 };
        const result = evaluateLineHealth(line, performanceSummary);

        expect(result.issues.map((issue) => issue.code)).toContain("OVER_PACING");
        expect(result.score).toBe(85);
        expect(result.status).toBe("WARNING");
    });    

    it("detects low CTR", () => {
        const performanceSummary = { ...healthyPerformance, ctr: 0.002 };
        const result = evaluateLineHealth(line, performanceSummary);

        expect(result.issues.map((issue) => issue.code)).toContain("LOW_CTR");
        expect(result.score).toBe(85);
        expect(result.status).toBe("WARNING");
    });  

    it("detects high CPA", () => {
        const performanceSummary = { ...healthyPerformance, cpa: 80 };
        const result = evaluateLineHealth(line, performanceSummary);

        const issue = result.issues.find(
        (item) => item.code ==="HIGH_CPA");

        expect(issue).toBeDefined();
        expect(issue?.code).toBe('HIGH_CPA');
        expect(issue?.threshold).toBe(50)
        expect(issue?.severity).toBe("WARNING");
    }); 

    it("does not apply the CPA rule to a non-CPA line", () => {
        const ctrLine = { ...line, goal_type: "CTR", goal_value: "0.008" };
        const result = evaluateLineHealth(ctrLine,
            {
            ...healthyPerformance,

            cpa:
                500,
            }
        );

        expect(result.issues.some((issue) => issue.code === "HIGH_CPA")).toBe(false);
    });

    it("forces CRITICAL status when a critical issue exists", () => {
        const result =
        evaluateLineHealth(
            line,
            {
            ...healthyPerformance,

            spend:
                5000,

            conversions:
                0,

            cpa:
                null,
            }
        );

        expect(
        result.issues.some(
            (issue) => issue.code === "NO_CONVERSIONS")).toBe(true);
        expect(result.score).toBe(60);
        expect(result.status).toBe("CRITICAL");
    });

    it("accumulates penalties from multiple issues", () => {
        const result =
        evaluateLineHealth(
            line,
            {
            ...healthyPerformance,
            pacingRatio: 0.5,
            ctr: 0.002,
            cpa: 70,
            }
        );

        expect(result.score).toBe(50);
        expect(result.status).toBe("CRITICAL");
        expect(result.issues).toHaveLength(3);
    });

    it("never returns a negative health score", () => {
        const result =
        evaluateLineHealth(
            line,
            {
            ...healthyPerformance,
            pacingRatio: 0.3,
            ctr: 0.001,
            conversions: 0,
            cpa: 100,
            spend: 10000
            }
        );

        expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });