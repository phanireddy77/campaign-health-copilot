import express from "express";
import cors from "cors";
import helmet from "helmet";
import db  from "./db/knex";
import { env } from "./config/env";
import advertiserRoutes from "./routes/advertiserRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import lineRoutes from "./routes/lineRoutes";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";
import {
  getHealth,
} from "./controllers/healthController.js";

const app = express();
const allowedOrigins =
  env.CORS_ORIGIN
    .split(",")
    .map(
      (origin) =>
        origin.trim()
    )
    .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.disable("x-powered-by");
app.use( requestLogger);

app.get("/api", (_req, res) => {
  res.json({
    service: "Campaign Health API",
    version: "1.0.0",

    endpoints: {
      health: "/api/health",
      advertisers: "/api/advertisers",
      advertiserCampaigns:
        "/api/advertisers/:advertiserId/campaigns",
      campaign:
        "/api/campaigns/:campaignId",
      campaignLines:
        "/api/campaigns/:campaignId/lines",
      line:
        "/api/lines/:lineId",
      lineMetrics:
        "/api/lines/:lineId/metrics",
    }
  });
});

app.get("/api/health",getHealth);

app.use("/api/advertisers", advertiserRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/lines", lineRoutes);
app.use( notFoundHandler );
app.use( errorHandler );

export default app;