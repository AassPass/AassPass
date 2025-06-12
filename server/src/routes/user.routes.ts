import { Router } from "express";
import { CreateBusiness, GetBusinesses } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.middlewares";

const UserRouter = Router();

UserRouter.get('/businesses', GetBusinesses);
UserRouter.post('/business', userAuth, CreateBusiness);

export default UserRouter;