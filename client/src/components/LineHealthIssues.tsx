import type { HealthIssue } from "../types/health";

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
                        <article key={issue.code} className="health-issue">
                            <strong>{issue.code}</strong>
                            <span style={{marginLeft:'10px'}}>{issue.severity}</span>
                            <p>{issue.message}</p>
                            <p>Actual Value: {issue.actual}. Threshold is {issue.threshold}</p>
                        </article>
                    )
                )
            }
        </div>
     </section>
    );
}

export default LineHealthIssues;