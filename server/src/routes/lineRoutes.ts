import { Router } from "express";
import { getLine, getMetricsByLine, getLineHealthById } from "../controllers/lineController";
import { validateIdParam } from "../middleware/validateIDParam";

const router = Router();

router.get("/:lineId/health", validateIdParam("lineId"), getLineHealthById);
router.get("/:lineId/metrics", validateIdParam("lineId"), getMetricsByLine);
router.get("/:lineId", validateIdParam("lineId"), getLine);

export default router;