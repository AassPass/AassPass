import { Router } from "express";
import { CreateBusiness, GetBusinesses, GetUserInfo, GetAds } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";
import { businessImageUpload } from "../middlewares/multer.config";

const UserRouter = Router();

UserRouter.get('/profile', userAuth, GetUserInfo);
UserRouter.get('/businesses', GetBusinesses);
UserRouter.get('/get-ads', GetAds);
UserRouter.post('/business', userAuth, businessImageUpload, CreateBusiness);

export default UserRouter;