import { Router } from "express";
import { getCampaignDetails, listLinesByCampaign, getCampaignHealthDetails, getCampaignHealthAnalysis } from "../controllers/campaignController";

const router = Router();

router.post("/:campaignId/analyze", getCampaignHealthAnalysis);
router.get("/:campaignId/health", getCampaignHealthDetails);
router.get("/:campaignId/lines", listLinesByCampaign);
router.get("/:campaignId", getCampaignDetails);

export default router;