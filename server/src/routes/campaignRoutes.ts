import { Router } from "express";
import { getCampaignDetails, listLinesByCampaign, getCampaignHealthDetails } from "../controllers/campaignController";

const router = Router();

router.get("/:campaignId/health", getCampaignHealthDetails);
router.get("/:campaignId/lines", listLinesByCampaign);
router.get("/:campaignId", getCampaignDetails);

export default router;