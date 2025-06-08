import { Router } from "express";
import { authorize } from "../middlewares/auth.middlewares";
import { RegisterBusiness, UpdateBusiness, GetAds, ChangeAdStatus } from "../controllers/admin.controller";

const AdminRouter = Router();

AdminRouter.post("/business", authorize(["SUPER_ADMIN", "ADMIN"]), RegisterBusiness);
AdminRouter.put("/update-business/:businessId", authorize(["SUPER_ADMIN", "ADMIN"]), UpdateBusiness);
AdminRouter.get("/ads", authorize(["SUPER_ADMIN", "ADMIN"]), GetAds);
AdminRouter.patch("/ads/:adId/change-status", authorize(["SUPER_ADMIN", "ADMIN"]), ChangeAdStatus);

export default AdminRouter;