import { findLineById, findMetricsByLineId } from "../repositories/lineRepository";

export async function getLineById(id: number) {
    return findLineById(id);
}

export async function getMetricsByLineId(id: number) {
    const line = await findLineById(id);

    if (!line) {
        return null;
    }
    const metrics = await findMetricsByLineId(id);

    return {
        line,
        metrics
    };
}