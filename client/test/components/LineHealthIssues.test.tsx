import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LineHealthIssues  from "../../src/components/LineHealthIssues";

describe("Line Health Issues", () => {
    it("Renders", () => {
        render(<LineHealthIssues issues={[
              {
                code: "LOW_CTR",
                severity: "WARNING",
                message: "CTR is below the minimum expected threshold.",
                actual: 0.002,
                threshold: 0.005,
                penalty: 15
              }
            ]}></LineHealthIssues>
        );

        expect(screen.getByText("LOW_CTR")).toBeDefined();
        expect(screen.getByText("WARNING")).toBeDefined();
        expect(screen.getByText("CTR is below the minimum expected threshold.")).toBeDefined();
    });

    it("Line is Healthy", () => {
        render(<LineHealthIssues issues={[]}></LineHealthIssues>);
        expect(
          screen.getByText(
            /No performance issues found./i
          )
        ).toBeInTheDocument();
    })
});