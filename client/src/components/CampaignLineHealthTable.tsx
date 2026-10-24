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

import StatusBadge
  from "./StatusBadge";

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
                  <StatusBadge value={line.status} />
                </td>

                <td>
                  <span className={`score-cell score-${line.status.toLowerCase()}`}>
                    <span className="score-track" aria-hidden="true">
                      <span style={{ width: `${line.score}%` }} />
                    </span>
                    {line.score}
                  </span>
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
                  {line.issues.length > 0 ? (
                    <span className="issue-tags">
                      {line.issues.map((issue) => (
                        <code key={issue} className="issue-tag">
                          {issue}
                        </code>
                      ))}
                    </span>
                  ) : (
                    <span className="muted">None</span>
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

export default CampaignLineHealthTable;