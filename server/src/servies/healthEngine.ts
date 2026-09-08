import type { Line, LineMetric, LinePerformanceSummary } from "../types/domain";
import type { HealthIssueCode, HealthIssueSeverity, HealthIssue, LineHealthResult } from "../types/health";
import { HEALTH_THRESHOLDS } from "../config/healthThresholds";

export function evaluateLineHealth ( line: Line, performance: LinePerformanceSummary): LineHealthResult {
    const issues: HealthIssue[] = [];

    evaluatePacing(performance, issues);
    evaluateCtr(performance, issues);
    evaluateConversions(performance, issues);
    evaluateCpa(line, performance, issues);

    return {
        id: line.id,
        asOfDate: performance.asOfDate,
        issues
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
            threshold: HEALTH_THRESHOLDS.underPacingRatio
        });
        return;
    }
    if (pacingRatio >= HEALTH_THRESHOLDS.overPacingRatio) {
        issues.push({
            code: "OVER_PACING",
            severity: "WARNING",
            message: "Line spend is above the expected pacing level.",
            actual: pacingRatio,
            threshold: HEALTH_THRESHOLDS.overPacingRatio
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
            threshold: HEALTH_THRESHOLDS.minimumCtr
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
            threshold: 1
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
            threshold: cutoff
        });
    }
    return;
}