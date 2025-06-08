import { Router } from "express";
import { GetBusinesses } from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get('/businesses', GetBusinesses);

export default UserRouter;