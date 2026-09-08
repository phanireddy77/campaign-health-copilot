import MetricCard from "./MetricCard";

import type {
  LinePerformanceSummary,
} from "../types/domain";

import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
} from "../utils/formatters";

interface PerformanceSummaryProps {
  summary: LinePerformanceSummary;
}

function PerformanceSummary({
  summary,
}: PerformanceSummaryProps) {
  return (
    <section>
      <p>
        Reporting through:
        {" "}
        {summary.asOfDate ?? "No data"}
      </p>

      <div className="metrics-grid">

        <MetricCard
          label="Spend"
          value={formatCurrency(
            summary.spend
          )}
        />

        <MetricCard
          label="Budget"
          value={formatCurrency(
            summary.budget
          )}
        />

        <MetricCard
          label="Budget Utilization"
          value={formatPercent(
            summary.budgetUtilization
          )}
        />

        <MetricCard
          label="Impressions"
          value={formatNumber(
            summary.impressions
          )}
        />

        <MetricCard
          label="Clicks"
          value={formatNumber(
            summary.clicks
          )}
        />

        <MetricCard
          label="CTR"
          value={formatPercent(
            summary.ctr
          )}
        />

        <MetricCard
          label="Conversions"
          value={formatNumber(
            summary.conversions
          )}
        />

        <MetricCard
          label="CPC"
          value={formatCurrency(
            summary.cpc
          )}
        />

        <MetricCard
          label="CPA"
          value={formatCurrency(
            summary.cpa
          )}
        />

        <MetricCard
          label="Revenue"
          value={formatCurrency(
            summary.revenue
          )}
        />

        <MetricCard
          label="ROAS"
          value={formatRatio(
            summary.roas
          )}
        />

        <MetricCard
          label="Expected Spend"
          value={formatCurrency(
            summary.expectedSpend
          )}
        />

        <MetricCard
          label="Pacing"
          value={formatRatio(
            summary.pacingRatio
          )}
          secondary={
            `${formatPercent(
              summary.elapsedFlightPercentage
            )} of flight elapsed`
          }
        />

      </div>
    </section>
  );
}

export default PerformanceSummary;