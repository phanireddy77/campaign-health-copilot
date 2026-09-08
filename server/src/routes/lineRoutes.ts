import { Router } from "express";
import { getLine, getMetricsByLine, getLineHealthById } from "../controllers/lineController";

const router = Router();

router.get("/:lineId/health", getLineHealthById);
router.get("/:lineId/metrics", getMetricsByLine);
router.get("/:lineId", getLine);

export default router;