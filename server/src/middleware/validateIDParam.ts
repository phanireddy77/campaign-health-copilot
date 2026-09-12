import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AppError,
} from "../errors/AppError.js";

export function validateIdParam(
  paramName: string
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const value =
      Number(
        req.params[paramName]
      );

    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      return next(
        new AppError(
          400,
          "INVALID_ID",
          `${paramName} must be a positive integer.`
        )
      );
    }

    next();
  };
}