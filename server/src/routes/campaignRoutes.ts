import { Router } from "express";
import { getCampaignDetails, listLinesByCampaign, getCampaignHealthDetails, getCampaignHealthAnalysis } from "../controllers/campaignController";
import { validateIdParam } from "../middleware/validateIDParam";
const router = Router();

router.post("/:campaignId/analyze", validateIdParam("campaignId"), getCampaignHealthAnalysis);
router.get("/:campaignId/health", validateIdParam("campaignId"), getCampaignHealthDetails);
router.get("/:campaignId/lines", validateIdParam("campaignId"), listLinesByCampaign);
router.get("/:campaignId", validateIdParam("campaignId"), getCampaignDetails);

export default router;