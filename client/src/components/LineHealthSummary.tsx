import type { LineHealthResult } from "../types/lineHealth";
import StatusBadge from "./StatusBadge";
import ScoreRing from "./ScoreRing";

interface HealthSummaryProps {
    health: LineHealthResult;
}

function LineHealthSummary({ health }: HealthSummaryProps) {
    const totalPenalty = health.issues.reduce((total, issue) => total + issue.penalty, 0);

    return (
        <section>
            <div className="health-summary">
                <div className="health-card health-card-score">
                    <ScoreRing score={health.score} status={health.status} />
                    <div>
                        <span className="metric-label">Health Score</span>
                        <StatusBadge value={health.status} />
                    </div>
                </div>
                <div className="health-card">
                    <span className="metric-label">Issues</span>
                    <strong className="health-figure">{health.issues.length}</strong>
                    <span className="health-note">
                        {totalPenalty > 0 ? `−${totalPenalty} points in penalties` : "No penalties applied"}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default LineHealthSummary;
