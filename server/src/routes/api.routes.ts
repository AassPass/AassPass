import { Router } from 'express';
import { getHome } from '../controllers/api.controller';

const apiRoutes = Router();

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

declare module "express" {
    interface Request {
        user?: UserPayload;
    }
}

apiRoutes.get("/", getHome);

export default apiRoutes;