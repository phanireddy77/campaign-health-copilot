import { Request, Response } from "express";
import { getLineById, getMetricsByLineId } from "../servies/lineService";

export async function getLine(req: Request, res: Response) {
    const id = Number(req.params.lineId);

    if(!Number.isInteger(id)) {
        return res.status(404).json({
            error: 'INVALID_LINE_ID',
            message: 'Invalid line id'
        });
    }
    const line = await getLineById(id);

    if (!line) {
        return res.status(404).json({
        error: {
            code: "LINE_NOT_FOUND",
            message: `Line ${id} was not found.`,
        },
        });
    }
    return res.json({
        data: line
    });
}

export async function getMetricsByLine(req: Request, res: Response) {
    const id = Number(req.params.lineId);

    if(!Number.isInteger(id)) {
        return res.status(404).json({
            error: 'INVALID_LINE_ID',
            message: 'Invalid line id'
        });
    }
    const response = await getMetricsByLineId(id);

    if (!response) {
        return res.status(404).json({
        error: {
            code: "LINE_NOT_FOUND",
            message: `Line ${id} was not found.`,
        },
        });
    }

    return res.json({
        data: response
    });

}