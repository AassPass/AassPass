import { Router } from "express";
import { CreateBusiness, GetBusinesses, GetUserInfo } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";

const UserRouter = Router();

UserRouter.get('/profile', userAuth, GetUserInfo);
UserRouter.get('/businesses', GetBusinesses);
UserRouter.post('/business', userAuth, CreateBusiness);

export default UserRouter;