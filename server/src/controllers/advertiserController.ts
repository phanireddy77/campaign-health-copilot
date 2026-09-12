import { Request, Response } from "express";
import { AppError } from "../errors/AppError";

import { getAllAdvertiser, getAdvertiserById, getCampaignsByAdvertiser } from "../servies/advertiserService";

export async function listAdvertisers(req: Request, res: Response) {
    const advertisers = await getAllAdvertiser();
    return res.json({ data: advertisers });
}

export async function getAdvertiser(req: Request, res: Response) {
   const advId = Number(req.params.advertiserId);
   const advertiser = await getAdvertiserById(Number(advId));

    if (!advertiser) {
        throw new AppError(404, "ADVERTISER_NOT_FOUND", `Advertiser ${advId} not found`);
    }
    return res.json({
        data: advertiser
    });
}

export async function listCampaignsByAdvertiser(req: Request, res: Response) {
   const advId = Number(req.params.advertiserId);
   const result = await getCampaignsByAdvertiser(Number(advId));

    if (!result) {
        throw new AppError(404, "ADVERTISER_NOT_FOUND", `Advertiser ${advId} not found`);
    }

    return res.json({
        data: result
    });
}