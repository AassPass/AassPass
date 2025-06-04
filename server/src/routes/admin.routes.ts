import { Router } from "express";
import { authorize } from "../middlewares/auth.middlewares";
import { RegisterBusiness, UpdateBusiness } from "../controllers/admin.controller";

const AdminRouter = Router();

AdminRouter.post("/business", authorize(["SUPER_ADMIN", "ADMIN"]), RegisterBusiness);
AdminRouter.put("/update-business/:businessId", authorize(["SUPER_ADMIN", "ADMIN"]), UpdateBusiness);

export default AdminRouter;