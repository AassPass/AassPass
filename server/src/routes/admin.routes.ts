import { Router } from "express";
import { authorize } from "../middlewares/auth.middlewares";
import { RegisterBusiness, UpdateBusiness, VerifyAd, GetAds, ChangeAdStatus } from "../controllers/admin.controller";

const AdminRouter = Router();

AdminRouter.post("/business", authorize(["SUPER_ADMIN", "ADMIN"]), RegisterBusiness);
AdminRouter.post("/update-business/:businessId", authorize(["SUPER_ADMIN", "ADMIN"]), UpdateBusiness);
AdminRouter.patch("/ads", authorize(["SUPER_ADMIN", "ADMIN"]), GetAds);
AdminRouter.patch("/verify-ad/:adId", authorize(["SUPER_ADMIN", "ADMIN"]), VerifyAd);
AdminRouter.patch("ads/:adId/change-status", authorize(["SUPER_ADMIN", "ADMIN"]), ChangeAdStatus);

export default AdminRouter;