import {
  randomUUID,
} from "node:crypto";

import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next) => {
    const requestId = randomUUID();
    const startTime = Date.now();

    res.locals.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const data = JSON.stringify({
            requestId,
            duration,
            method: req.method,
            statusCode: req.statusCode,
            url: req.originalUrl
        });
        console.log(data);
    });
    next();
}