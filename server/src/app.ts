import express from "express";
import cors from "cors";
import db  from "./db/knex";
import advertiserRoutes from "./routes/advertiserRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import lineRoutes from "./routes/lineRoutes";

const app = express();

app.use(cors());
app.use(express.json());

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

app.get("/api/health", async (_req, res) => {
  try {
    await db.raw("SELECT 1");
    const dt = new Date();
    dt.setMilliseconds(0); // Remove milliseconds for consistency

    res.json({
      status: "healthy",
      service: "campaign-health-api",
      database: "connected",
      timestamp: dt.toISOString().replace(".000Z", "Z")
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      service: "campaign-health-api",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/advertisers", advertiserRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/lines", lineRoutes);

export default app;