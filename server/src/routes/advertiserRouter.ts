import { Router } from "express";

import { listAdvertisers, getAdvertiser, listCampaignsByAdvertiser } from "../controllers/advertiserController";

const router = Router();

router.get("/", listAdvertisers);
router.get("/:advertiserId", getAdvertiser);
router.get("/:advertiserId/campaigns", listCampaignsByAdvertiser);

export default router;