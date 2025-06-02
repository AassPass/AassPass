import { Router } from "express";
import { AdminLogin, AdminRegister } from "../controllers/adminAuth.controller";

const AdminAuthRouter = Router();

AdminAuthRouter.post("/register", AdminRegister);
AdminAuthRouter.post("/login", AdminLogin);

export default AdminAuthRouter;