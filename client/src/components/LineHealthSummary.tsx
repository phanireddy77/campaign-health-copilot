import type { LineHealthResult } from "../types/lineHealth";
import StatusBadge from "./StatusBadge";

interface HealthSummaryProps {
    health: LineHealthResult;
}

function LineHealthSummary({ health }: HealthSummaryProps) {
    return (
        <section>
            <div className="health-summary">
                <div>
                    <span className="metric-label">Health Score</span>
                    <strong className="health-score">
                        <span>{health.score}</span>
                        <small> / 100</small>
                    </strong>
                </div>
                <div>
                    <span className="metric-label">Status</span>
                    <StatusBadge value={health.status} />
                </div>
                <div>
                    <span className="metric-label">Issues</span>
                    <strong className="health-score">{health.issues.length}</strong>
                </div>
            </div>
        </section>
    )
}

export default LineHealthSummary;
