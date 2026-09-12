import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = (err, req, res,  _next) => {
    const reqId = res.locals.requestId;

    if (err instanceof AppError) {
        return res
                .status(err.statusCode)
                .json({
                    error: { 
                        code: err.code,
                        message: err.message,
                        ...(err.details !== undefined && { details: err.details }),
                        requestId: reqId
                    }
                });
                   
    }
    console.error("Unhandled API error", { 
        requestId: reqId,
        method: req.method,
        path: req.originalUrl,
        error: err,
      }
    );
    return res
      .status(500)
      .json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected server error occurred.",
          requestId: reqId,
          ...(env.NODE_ENV ===
            "DEVELOPMENT" &&
          err instanceof Error
            ? {
                debug:
                err.message,
              }
            : {}),
        },
      });
};