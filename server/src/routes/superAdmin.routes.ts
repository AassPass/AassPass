import { Router } from "express";
import {
  CreateAdmin,
  GetAdmins,
  GetBusinesses,
  UpdateAdmin,
  VerifyBusiness,
  DeleteAdmin,
} from "../controllers/superAdmin.controller";
import { authorize } from "../middlewares/auth.middlewares";

const SuperAdminRouter = Router();

// admins endpoints
SuperAdminRouter.post("/admin", authorize(["SUPER_ADMIN"]), CreateAdmin);
SuperAdminRouter.get("/admins", authorize(["SUPER_ADMIN"]), GetAdmins);
SuperAdminRouter.put("/admin/update/:adminId", authorize(["SUPER_ADMIN"]), UpdateAdmin);
SuperAdminRouter.delete("/admin/:adminId", authorize(["SUPER_ADMIN"]), DeleteAdmin);

// business endpoints
SuperAdminRouter.patch("/business/verify/:businessId", authorize(["SUPER_ADMIN"]), VerifyBusiness);
SuperAdminRouter.get("/businesses", authorize(["SUPER_ADMIN"]), GetBusinesses);
SuperAdminRouter.delete("/business/:businessId", authorize(["SUPER_ADMIN"]), GetBusinesses);


export default SuperAdminRouter;
