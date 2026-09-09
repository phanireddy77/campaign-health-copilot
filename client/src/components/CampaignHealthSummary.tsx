import type { CampaignHealthResult } from "../types/campaignHealth";
import { formatCurrency, formatPercent } from "../utils/formatters";

interface Props {
    health: CampaignHealthResult;
}

function CampaignHealthSummary({ health, }: Props) {
    return (
        <section>
            <div className="health-summary">
                <div>
                    <span className="metric-label">
                        Health Score
                    </span>

                    <strong className="health-score">
                        {health.score}
                        <small>
                        {" "}
                        / 100
                        </small>
                    </strong>
                </div>

                <div>
                    <span className="metric-label">
                        Status
                    </span>

                    <strong>
                        {health.status}
                    </strong>
                </div>

                <div>
                    <span className="metric-label">
                        Total Spend
                    </span>
                    <strong>
                        {formatCurrency(
                        health.totalSpend
                        )}
                    </strong>
                </div>
                <div>
                    <span className="metric-label">
                        Critical Exposure
                    </span>

                    <strong>
                        {formatPercent(
                        health.criticalExposure
                        )}
                    </strong>
                </div>

                <div>
                    <span className="metric-label">
                        Warning Exposure
                    </span>

                    <strong>
                        {formatPercent(
                        health.warningExposure
                        )}
                    </strong>
                </div>

                <div>
                    <span className="metric-label">
                        Healthy Exposure
                    </span>

                    <strong>
                        {formatPercent(
                        health.healthyExposure
                        )}
                    </strong>
                </div>
            </div>
        </section>
    )
}

export default CampaignHealthSummary;