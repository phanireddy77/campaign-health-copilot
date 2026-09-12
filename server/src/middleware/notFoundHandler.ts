import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler: RequestHandler = (req, res, next) => {
    next(
        new AppError(
            404,
            "ROUTE_NOT_FOUND",
            `Route ${req.method}  ${req.originalUrl} was not found`
        )
    );
}