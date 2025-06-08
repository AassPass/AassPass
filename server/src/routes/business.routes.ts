import { Router } from "express";
import { CreateAd, GetAds, UpdateAd } from "../controllers/business.controller";
import { businessAuth } from "../middlewares/businessAuth.middlewares";


const BusinessRouter = Router();

BusinessRouter.post("/:businessId/new-ad", businessAuth, CreateAd);
BusinessRouter.put("/ad/:adId", businessAuth, UpdateAd);
BusinessRouter.get("/:businessId/ads", businessAuth, GetAds);

export default BusinessRouter;