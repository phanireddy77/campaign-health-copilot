import type { CampaignHealthResult } from "../types/campaignHealth";
import { formatCurrency } from "../utils/formatters";
import StatusBadge from "./StatusBadge";
import ScoreRing from "./ScoreRing";
import ExposureBar from "./ExposureBar";

interface Props {
    health: CampaignHealthResult;
}

function CampaignHealthSummary({ health, }: Props) {
    return (
        <section>
            <div className="health-summary">
                <div className="health-card health-card-score">
                    <ScoreRing score={health.score} status={health.status} />
                    <div>
                        <span className="metric-label">
                            Health Score
                        </span>
                        <StatusBadge value={health.status} />
                    </div>
                </div>

                <div className="health-card">
                    <span className="metric-label">
                        Total Spend
                    </span>
                    <strong className="health-figure">
                        {formatCurrency(
                        health.totalSpend
                        )}
                    </strong>
                    <span className="health-note">
                        Across {health.lines.length} lines
                    </span>
                </div>

                <div className="health-card health-card-wide">
                    <span className="metric-label">
                        Spend Exposure by Line Health
                    </span>
                    <ExposureBar
                        critical={health.criticalExposure}
                        warning={health.warningExposure}
                        healthy={health.healthyExposure}
                    />
                </div>
            </div>
        </section>
    )
}

export default CampaignHealthSummary;
