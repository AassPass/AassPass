import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes";
import AdminAuthRouter from "./routes/adminAuth.routes";
import SuperAdminAuthRouter from "./routes/superAdmin.routes";
// import authRouter from "./routes/auth.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

app.use('/api', apiRoutes);
app.use('/auth/super-admin', SuperAdminAuthRouter);
app.use('/auth/admin', AdminAuthRouter);
// app.use('/auth', authRouter);
// app.use('/restaurant', restaurantRouter);
// app.use('/menu', menuRouter);

export default app;