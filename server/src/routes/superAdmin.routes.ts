import { Router } from "express";
import {
  CreateAdmin,
  GetAdmins,
  GetBusiness,
  VerifyBusiness
} from "../controllers/superAdmin.controller";
import { authorize } from "../middlewares/auth.middlewares";

const SuperAdminRouter = Router();

// Only SUPER_ADMIN can create new admins or view businesses
SuperAdminRouter.post("/admin", authorize(["SUPER_ADMIN"]), CreateAdmin);
SuperAdminRouter.patch("/business/verfiy/:businessId", authorize(["SUPER_ADMIN"]), VerifyBusiness);
SuperAdminRouter.get("/admins", authorize(["SUPER_ADMIN"]), GetAdmins);

// SUPER_ADMIN and ADMIN can register or update business info
SuperAdminRouter.get("/business", authorize(["SUPER_ADMIN", "ADMIN"]), GetBusiness);


export default SuperAdminRouter;
