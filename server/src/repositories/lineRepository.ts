import db from "../db/knex";
import { Line, LineMetric } from "../types/domain";

export async function findLineById(id: number): Promise<Line | undefined> {
    return db<Line>("lines")
            .select("*")
            .where({ id: id})
            .first();
}

export async function findMetricsByLineId(id: number): Promise<LineMetric[]> {
    return db<LineMetric>("line_metrics")
            .select("*")
            .where({ line_id: id })
            .orderBy("metric_date", "asc");
}