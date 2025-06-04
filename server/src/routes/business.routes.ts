import { Router } from "express";
import { CreateAd, GetAds } from "../controllers/business.controller";


const BusinessRouter = Router();

BusinessRouter.post("/:businessId/new-ad", CreateAd);
BusinessRouter.get("/:businessId/ads", GetAds);

export default BusinessRouter;