import { Router } from "express";
import { AdminLogin, AdminRegister, BusinessLogin, BusinessRegister } from "../controllers/auth.controller";

const AuthRouter = Router();

// admin auth routes
AuthRouter.post("/admin/register", AdminRegister);
AuthRouter.post("/admin/login", AdminLogin);

// business auth routes
AuthRouter.post("/business/register", BusinessRegister);
AuthRouter.post("/business/login", BusinessLogin);

export default AuthRouter;