import { Router } from "express";
import { getLine, getMetricsByLine } from "../controllers/lineController";

const router = Router();

router.get("/:lineId", getLine);
router.get("/:lineId/metrics", getMetricsByLine);

export default router;