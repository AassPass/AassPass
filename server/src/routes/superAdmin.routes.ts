import { Router } from "express";
import { CreateAdmin, SuperAdminLogin, RegisterBusiness, UpdateBusiness, SuperAdminRegister, GetBusiness } from "../controllers/superAdminAuth.controller";
import { authorize } from "../middlewares/auth.middlewares";

const SuperAdminAuthRouter = Router();

SuperAdminAuthRouter.post("/register", SuperAdminRegister);
SuperAdminAuthRouter.post("/login", SuperAdminLogin);
SuperAdminAuthRouter.post("/business", authorize(["SUPER_ADMIN, ADMIN"]), RegisterBusiness);
SuperAdminAuthRouter.post("/update-business", authorize(["SUPER_ADMIN, ADMIN"]), UpdateBusiness);
SuperAdminAuthRouter.post("/admin", authorize(["SUPER_ADMIN"]), CreateAdmin);
SuperAdminAuthRouter.get("/business", authorize(["SUPER_ADMIN"]), GetBusiness);

export default SuperAdminAuthRouter;