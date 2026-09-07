import type {
  LineMetric,
} from "../types/domain";

import {
  formatCurrency,
  formatNumber,
} from "../utils/formatters";

interface DailyMetricsTableProps {
  metrics: LineMetric[];
}

function DailyMetricsTable({
  metrics,
}: DailyMetricsTableProps) {
  return (
    <section>
      <h3>
        Daily Performance
      </h3>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Spend</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td>
                  {metric.metric_date}
                </td>

                <td>
                  {formatCurrency(
                    Number(metric.spend)
                  )}
                </td>

                <td>
                  {formatNumber(
                    metric.impressions
                  )}
                </td>

                <td>
                  {formatNumber(
                    metric.clicks
                  )}
                </td>

                <td>
                  {formatNumber(
                    metric.conversions
                  )}
                </td>

                <td>
                  {formatCurrency(
                    Number(metric.revenue)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DailyMetricsTable;