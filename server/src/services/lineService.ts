import { findLineById, findMetricsByLineId } from "../repositories/lineRepository";
import { calculateLinePerformance } from "./lineMetricService";

export async function getLineById(id: number) {
    return findLineById(id);
}

export async function getLineMetrics(id: number) {
    const line = await findLineById(id);

    if (!line) {
        return null;
    }
    const metrics = await findMetricsByLineId(id);
    const summary = calculateLinePerformance(line, metrics);

    return {
        line,
        metrics,
        summary
    };
}