import type { LineHealthResult } from "../types/lineHealth";

interface HealthSummaryProps {
    health: LineHealthResult;
}

function LineHealthSummary({ health, }: HealthSummaryProps) {
    return (
        <section>
            <div className="health-summary">
                <div>
                    <span className="metric-label">Health Score</span>
                    <strong className="health-score">{health.score}</strong>
                    <small> / 100</small>
                </div>
                <div>
                    <span className="metric-label">Status</span>
                    <strong>{health.status}</strong>
                </div>
                <div>
                    <span className="metric-label">Issues</span>
                    <strong>{health.issues.length}</strong>
                </div>
            </div>
        </section>
    )
}

export default LineHealthSummary;