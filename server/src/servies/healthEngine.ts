import type { Line, LineMetric, LinePerformanceSummary } from "../types/domain";
import type { HealthIssueCode, HealthIssueSeverity, HealthIssue, HealthStatus, LineHealthResult } from "../types/health";
import { HEALTH_THRESHOLDS, HEALTH_PENALTIES, HEALTH_SCORE_THRESHOLDS } from "../config/healthThresholds";


export function evaluateLineHealth ( line: Line, performance: LinePerformanceSummary): LineHealthResult {
    const issues: HealthIssue[] = [];

    evaluatePacing(performance, issues);
    evaluateCtr(performance, issues);
    evaluateConversions(performance, issues);
    evaluateCpa(line, performance, issues);

    const score = calculateHealthScore(issues);
    const status = determineHealthStatus(issues, score);

    return {
        id: line.id,
        asOfDate: performance.asOfDate,
        issues,
        score,
        status
    };
}

function evaluatePacing ( performance: LinePerformanceSummary, issues: HealthIssue[]) {
    const pacingRatio = performance.pacingRatio;

    if (!pacingRatio) {
        return null;
    }
    if (pacingRatio < HEALTH_THRESHOLDS.underPacingRatio) {
        issues.push({
            code: "UNDER_PACING",
            severity: "WARNING",
            message: "Line spend is below the expected pacing level.",
            actual: pacingRatio,
            threshold: HEALTH_THRESHOLDS.underPacingRatio,
            penalty: HEALTH_PENALTIES.UNDER_PACING
        });
        return;
    }
    if (pacingRatio >= HEALTH_THRESHOLDS.overPacingRatio) {
        issues.push({
            code: "OVER_PACING",
            severity: "WARNING",
            message: "Line spend is above the expected pacing level.",
            actual: pacingRatio,
            threshold: HEALTH_THRESHOLDS.overPacingRatio,
            penalty: HEALTH_PENALTIES.OVER_PACING
        });
    }
}

function evaluateCtr (performance: LinePerformanceSummary, issues: HealthIssue[]) {
    const ctr = performance.ctr;

    if (!ctr) {
        return null;
    }
    if (ctr < HEALTH_THRESHOLDS.minimumCtr) {
        issues.push({
            code: "LOW_CTR",
            severity: "WARNING",
            message: "CTR is below the minimum expected threshold.",
            actual: ctr,
            threshold: HEALTH_THRESHOLDS.minimumCtr,
            penalty: HEALTH_PENALTIES.LOW_CTR
        });
        return;
    }
}

function evaluateConversions (performance: LinePerformanceSummary, issues: HealthIssue[]) {
    const conversions = performance.conversions;
    if (conversions === null) {
        return null;
    }
    if (performance.spend > HEALTH_THRESHOLDS.noConversionMinimumSpend && performance.conversions === 0) {
            issues.push({
            code: "NO_CONVERSIONS",
            severity: "CRITICAL",
            message: "The line has significant spend but no conversions.",
            actual: conversions,
            threshold: 1,
            penalty: HEALTH_PENALTIES.NO_CONVERSIONS
        });
        return;
    }
}

function evaluateCpa( line: Line, performance: LinePerformanceSummary, issues: HealthIssue[]) {
    const goalType = line.goal_type;
    const goalValue = Number(line.goal_value);
    const cpa = performance.cpa;

    if (goalType !== 'CPA') {
        return null;
    }
    if (line.goal_value === null) {
        return null;
    }
    if (cpa === null) {
        return null;
    }
    const cutoff = goalValue * HEALTH_THRESHOLDS.highCpaMultiplier;

    if (cpa > cutoff) {
            issues.push({
            code: "HIGH_CPA",
            severity: "WARNING",
            message: "CPA is materially above the line target.",
            actual: cpa,
            threshold: cutoff,
            penalty: HEALTH_PENALTIES.HIGH_CPA
        });
    }
    return;
}

function calculateHealthScore(issues: HealthIssue[]) {
    const totalScore = issues.reduce((total, issue) => total + issue.penalty, 0);

    return Math.max(0, 100 - totalScore);
}

function determineHealthStatus(issues: HealthIssue[], score: number) {
    const hasCriticalIssue = issues.some((issue) => issue.severity === 'CRITICAL');

    if (hasCriticalIssue) {
        return "CRITICAL";
    }
    if (score >= 90) {
        return "HEALTHY";
    } else if(score < 90 && score >= 60) {
        return "WARNING";
    }

    return "CRITICAL";
}