import type { HealthIssue } from "../types/lineHealth";
import StatusBadge from "./StatusBadge";

interface HealthIssueProps {
    issues: HealthIssue[];
}

function LineHealthIssues({ issues }: HealthIssueProps) {
    if (!issues.length) {
        return (
            <section>
                <p>
                    No performance issues found.
                </p>
            </section>
        );
    }
    
    return (
      <section>
        <h3>Detected Issues</h3>
        <div className="health-issues">
            {
                issues.map(
                    (issue) => (
                        <article key={issue.code} className={`health-issue health-issue-${issue.severity.toLowerCase()}`}>
                            <div className="health-issue-header">
                                <strong>{issue.code}</strong>
                                <StatusBadge value={issue.severity} />
                            </div>
                            <p>{issue.message}</p>
                            <p className="health-issue-detail">
                                {issue.actual && (
                                    <span>Actual {issue.actual.toFixed(2)} · Threshold {issue.threshold}</span>
                                )}
                                <span>Health penalty −{issue.penalty}</span>
                            </p>
                        </article>
                    )
                )
            }
        </div>
     </section>
    );
}

export default LineHealthIssues;