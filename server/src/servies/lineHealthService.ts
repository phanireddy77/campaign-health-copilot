import { findLineById, findMetricsByLineId } from "../repositories/lineRepository";
import { calculateLinePerformance } from "./lineMetricService";
import { evaluateLineHealth } from "./healthEngine";

export async function getLineHealth(lineId: number) {
    const line = await findLineById(lineId);

    if(!line) {
        return null;
    }

    const lineMetrics = await findMetricsByLineId(lineId);

    if(!lineMetrics || (lineMetrics && lineMetrics.length === 0)) {
        return null;
    }

    const lineMetricSummary =  calculateLinePerformance(line, lineMetrics);
    const lineHealth = evaluateLineHealth(line, lineMetricSummary);

    return {
        line,
        performanceSummary: lineMetricSummary,
        health: lineHealth
    };
}