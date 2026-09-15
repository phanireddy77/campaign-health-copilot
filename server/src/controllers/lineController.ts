import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { getLineById, getLineMetrics } from "../services/lineService";
import { getLineHealth } from "../services/lineHealthService";

export async function getLine(req: Request, res: Response) {
    const id = Number(req.params.lineId);
    const line = await getLineById(id);

    if (!line) {
        throw new AppError(404, "LINE_NOT_FOUND", `Line ${id} not found`);
    }
    return res.json({
        data: line
    });
}

export async function getMetricsByLine(req: Request, res: Response) {
    const id = Number(req.params.lineId);
    const response = await getLineMetrics(id);

    if (!response) {
        throw new AppError(404, "LINE_NOT_FOUND", `Line ${id} not found`);
    }

    return res.json({
        data: response
    });
}

export async function getLineHealthById(req: Request, res: Response) {
    const id = Number(req.params.lineId);
    const response = await getLineHealth(id);

    if (!response) {
        throw new AppError(404, "LINE_NOT_FOUND", `Line ${id} not found`);
    }
    
    return res.json({
        data: response
    });
}