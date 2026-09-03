import { Router } from "express";
import { getCampaignDetails, listLinesByCampaign } from "../controllers/campaignController";

const router = Router();

router.get("/:campaignId", getCampaignDetails);
router.get("/:campaignId/lines", listLinesByCampaign);

export default router;