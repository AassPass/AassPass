import { Router } from "express";
import { UpdateUserInfo, CreateBusiness, GetBusinesses, GetUserInfo, GetAds } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";
import { businessImageUpload } from "../middlewares/multer.config";

const UserRouter = Router();

UserRouter.get('/profile', userAuth, GetUserInfo);
UserRouter.put('/profile', userAuth, businessImageUpload, UpdateUserInfo);
UserRouter.get('/businesses', GetBusinesses);
UserRouter.get('/get-ads', GetAds);
UserRouter.post('/business', userAuth, CreateBusiness);

export default UserRouter;