import type {
  Request,
  Response,
} from "express";

import db from "../db/knex.js";

import {
  AppError,
} from "../errors/AppError.js";

import {
  env,
} from "../config/env.js";

export async function getHealth(
  _req: Request,
  res: Response
) {
  try {
    await db.raw(
      "SELECT 1"
    );
  } catch {
    throw new AppError(
      503,
      "DATABASE_UNAVAILABLE",
      "Database connectivity check failed."
    );
  }

  res.json({
    status:
      "healthy",

    service:
      "campaign-health-api",

    database:
      "connected",

    environment:
      env.NODE_ENV,

    timestamp:
      new Date()
        .toISOString(),
  });
}