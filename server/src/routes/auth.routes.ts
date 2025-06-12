import { Router } from "express";
import { AdminLogin, AdminRegister, UserLogin, UserRegister, VerifyEmail } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/verify-email", VerifyEmail);

// admin auth routes
AuthRouter.post("/admin/register", AdminRegister);
AuthRouter.post("/admin/login", AdminLogin);

// business auth routes
// AuthRouter.post("/business/register", BusinessRegister);
// AuthRouter.post("/business/login", BusinessLogin);

AuthRouter.post("/user/register", UserRegister);
AuthRouter.post("/user/login", UserLogin);

export default AuthRouter;