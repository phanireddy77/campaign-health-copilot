import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CampaignCopilot  from "../../src/components/CampaignCopilot";

describe("Campaign copilot tests", () => {
    it("distinguishes possible causes from observed concerns", () => {
        render(<CampaignCopilot analysis={
             {  executiveSummary: "Campaign requires investigation.",
              primaryConcerns: [
                {
                  title: "No conversions",
                  severity: "HIGH",
                  evidence: "Retargeting has spend but no conversions.",
                },
              ],
              likelyCauses: [
                {
                  cause: "Conversion tracking issue",
                  confidence: "MEDIUM",
                  reasoning: "Tracking should be validated."
                }
              ],
              recommendedChecks: [ "Validate conversion events"],
              recommendedActions: ["Investigate before changing budgets"]
            }
        }></CampaignCopilot>);
       expect(
          screen.getByText(
            "Possible Causes"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /not confirmed root causes/i
          )
        ).toBeInTheDocument();
    });
});