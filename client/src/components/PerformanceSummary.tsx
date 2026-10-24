import MetricCard from "./MetricCard";

import type {
  LinePerformanceSummary,
} from "../types/domain";

import {
  formatCurrency,
  formatDate,
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
      <p className="muted">
        Reporting through:
        {" "}
        {summary.asOfDate ? formatDate(summary.asOfDate) : "No data"}
      </p>

      <div className="metrics-grid">

        <MetricCard
          label="Spend"
          tone="blue"
          value={formatCurrency(
            summary.spend
          )}
        />

        <MetricCard
          label="Budget"
          tone="blue"
          value={formatCurrency(
            summary.budget
          )}
        />

        <MetricCard
          label="Budget Utilization"
          tone="blue"
          value={formatPercent(
            summary.budgetUtilization
          )}
        />

        <MetricCard
          label="Impressions"
          tone="teal"
          value={formatNumber(
            summary.impressions
          )}
        />

        <MetricCard
          label="Clicks"
          tone="teal"
          value={formatNumber(
            summary.clicks
          )}
        />

        <MetricCard
          label="CTR"
          tone="teal"
          value={formatPercent(
            summary.ctr
          )}
        />

        <MetricCard
          label="Conversions"
          tone="violet"
          value={formatNumber(
            summary.conversions
          )}
        />

        <MetricCard
          label="CPC"
          tone="violet"
          value={formatCurrency(
            summary.cpc
          )}
        />

        <MetricCard
          label="CPA"
          tone="violet"
          value={formatCurrency(
            summary.cpa
          )}
        />

        <MetricCard
          label="Revenue"
          tone="green"
          value={formatCurrency(
            summary.revenue
          )}
        />

        <MetricCard
          label="ROAS"
          tone="green"
          value={formatRatio(
            summary.roas
          )}
        />

        <MetricCard
          label="Expected Spend"
          tone="amber"
          value={formatCurrency(
            summary.expectedSpend
          )}
        />

        <MetricCard
          label="Pacing"
          tone="amber"
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