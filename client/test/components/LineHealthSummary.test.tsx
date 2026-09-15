import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LineHealthSummary  from "../../src/components/LineHealthSummary";

describe("Line Health Summary Component", () => {
    it("Renders", () => {
        render (<LineHealthSummary health={{
              id: 1,
              asOfDate:
                "2026-08-29",
              score: 80,
              status: "WARNING",
              issues: [
                {
                  code: "UNDER_PACING",
                  severity: "WARNING",
                  message: "Line spend is below expected pacing.",
                  actual: 0.6,
                  threshold: 0.75,
                  penalty: 20
                }
              ]
        }} ></LineHealthSummary>);
        expect(screen.getByText("80")).toBeInTheDocument();
        expect(screen.getByText("WARNING")).toBeInTheDocument();
    });
});