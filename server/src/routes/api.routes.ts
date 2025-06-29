import { Router } from 'express';
import { getHome } from '../controllers/api.controller';

const apiRoutes = Router();

apiRoutes.get("/", getHome);

export default apiRoutes;