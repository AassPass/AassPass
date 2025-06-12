import { Router } from "express";
import { CreateAd, UpdateAd } from "../controllers/business.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";
import { GetAds } from "../controllers/admin.controller";


const BusinessRouter = Router();

BusinessRouter.post("/new-ad", userAuth, CreateAd);
BusinessRouter.put("/ad/:adId", userAuth, UpdateAd);
BusinessRouter.get("/ads", userAuth, GetAds);

export default BusinessRouter;