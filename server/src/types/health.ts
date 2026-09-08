export type HealthIssueCode = 
| "UNDER_PACING"
| "OVER_PACING"
| "LOW_CTR"
| "HIGH_CPA"
| "NO_CONVERSIONS";

export type HealthIssueSeverity = 
| "WARNING"
| "CRITICAL";

export type HealthStatus = 
| "HEALTHY"
| "WARNING"
| "CRITICAL";

export interface HealthIssue {
    code: HealthIssueCode;
    severity: HealthIssueSeverity;
    message: string;
    actual: number | null;
    threshold: number | null;
    penalty: number;
};

export interface LineHealthResult {
    id: number;
    asOfDate: string | null;
    score: number;
    status: HealthStatus;
    issues: HealthIssue[];
};