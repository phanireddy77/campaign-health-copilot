import { describe, it, expect } from "vitest";

import { calculateLinePerformance } from "../lineMetricService";
import { Line, LineMetric } from "../../types/domain";

const line: Line = {
    id: 1,
    name: "Test 1",
    campaign_id: 1,
    status: "ACTIVE",
    budget: "60000.00",
    daily_budget: "1000.00",
    goal_type: "CPA",
    goal_value: "40.00",
    start_date: "2026-08-01",
    end_date: "2026-09-30",
    created_at: new Date("2026-08-01T00:00:00Z"),
    updated_at: new Date("2026-08-01T00:00:00Z")
};

const lineMetrics: LineMetric[] = [{
        id: 1,
        line_id: 1,
        metric_date: "2026-08-01",
        spend: "100.00",
        impressions: 10000,
        clicks: 100,
        conversions: 5,
        revenue: "250.00",
        created_at:
        new Date("2026-08-01T00:00:00Z")
    },
    {
        id: 2,
        line_id: 1,
        metric_date: "2026-08-02",
        spend: "200.00",
        impressions: 20000,
        clicks: 200,
        conversions: 5,
        revenue: "350.00",
        created_at:
        new Date("2026-08-02T00:00:00Z")
  }];

  describe("calculateLinePerformance", () => {
    it("Calculate raw metrics", () => {
        const result = calculateLinePerformance(line, lineMetrics);

        expect(result.impressions).toBe(30000);
        expect(result.clicks).toBe(300);
        expect(result.spend).toBe(300);
        expect(result.conversions).toBe(10);
        expect(result.revenue).toBe(600);
        expect(result.asOfDate).toBe("2026-08-02");
    });

    it("Calculate derived metrics", () => {
        const result = calculateLinePerformance(line, lineMetrics);

        expect(result.ctr).toBeCloseTo(0.01);
        expect(result.cpa).toBeCloseTo(30);
        expect(result.cpc).toBeCloseTo(1);
        expect(result.pacingRatio).toBeCloseTo(0.15);
        expect(result.roas).toBeCloseTo(2);
    });

    it("Division by zero checks", () => {
        const zeroMetrics: LineMetric[] = [
            {
                id: 1,
                line_id: 1,
                metric_date: "2026-08-01",
                spend:"100.00", 
                impressions: 0,
                clicks: 0,
                conversions: 0,
                revenue:"0.00",
                created_at: new Date()
            }
        ];
        const result = calculateLinePerformance(line, zeroMetrics);

        expect(result.ctr).toBeNull();
        expect(result.cpa).toBeNull();
        expect(result.cpc).toBeNull();
    });
  });