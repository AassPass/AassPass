import { Router } from "express";
import { AdminLogin, AdminRegister, handleRestPassword, handleSendOTP, UserLogin, UserRegister, VerifyEmail } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/verify-email", VerifyEmail);

// admin auth routes
AuthRouter.post("/admin/register", AdminRegister);
AuthRouter.post("/admin/login", AdminLogin);


// user auth routes
AuthRouter.post("/user/register", UserRegister);
AuthRouter.post("/user/login", UserLogin);
AuthRouter.post("/user/verify-email", VerifyEmail);
AuthRouter.post("/user/send-otp", handleSendOTP);
AuthRouter.post("/user/reset-password", handleRestPassword);

export default AuthRouter;