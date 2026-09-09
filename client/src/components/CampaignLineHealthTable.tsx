import {
  Link,
} from "react-router-dom";

import type {
  CampaignLineHealth,
} from "../types/campaignHealth";

import {
  formatCurrency,
  formatPercent,
} from "../utils/formatters";

interface Props {
  lines: CampaignLineHealth[];
}

function CampaignLineHealthTable({
  lines,
}: Props) {
  return (
    <section>
      <h3>
        Line Health Priorities
      </h3>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Status</th>
              <th>Score</th>
              <th>Spend</th>
              <th>Spend Share</th>
              <th>Risk Contribution</th>
              <th>Issues</th>
            </tr>
          </thead>

          <tbody>
            {lines.map((line) => (
              <tr key={line.lineId}>

                <td>
                  <Link
                    to={`/lines/${line.lineId}`}
                  >
                    {line.lineName}
                  </Link>
                </td>

                <td>
                  {line.status}
                </td>

                <td>
                  {line.score}
                </td>

                <td>
                  {formatCurrency(
                    line.spend
                  )}
                </td>

                <td>
                  {formatPercent(
                    line.weight
                  )}
                </td>

                <td>
                  {formatPercent(
                    line.riskContribution
                  )}
                </td>

                <td>
                  {line.issues.length > 0
                    ? line.issues.join(", ")
                    : "None"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CampaignLineHealthTable;