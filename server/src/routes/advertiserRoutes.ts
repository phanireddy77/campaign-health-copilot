import { Router } from "express";

import { listAdvertisers, getAdvertiser, listCampaignsByAdvertiser } from "../controllers/advertiserController";
import { validateIdParam } from "../middleware/validateIDParam";

const router = Router();

router.get("/", listAdvertisers);
router.get("/:advertiserId", validateIdParam("advertiserId"), getAdvertiser);
router.get("/:advertiserId/campaigns",  validateIdParam("advertiserId"), listCampaignsByAdvertiser);

export default router;