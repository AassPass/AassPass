import { Router } from "express";
import { CreateAd, DeleteAd, UpdateAd } from "../controllers/business.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";
import { GetAds } from "../controllers/admin.controller";
import { upload } from "../middlewares/multer.config";


const BusinessRouter = Router();

BusinessRouter.post("/new-ad", userAuth, upload.array("images", 3), CreateAd);
BusinessRouter.put("/ad/:adId", userAuth, UpdateAd);
BusinessRouter.get("/ads", userAuth, GetAds);
BusinessRouter.delete("/ad/:id", userAuth, DeleteAd);

export default BusinessRouter;