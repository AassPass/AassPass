import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes";
import AuthRouter from "./routes/auth.routes";
import SuperAdminRouter from "./routes/superAdmin.routes";
import AdminRouter from "./routes/admin.routes";
import BusinessRouter from "./routes/business.routes";
import UserRouter from "./routes/user.routes";
// import authRouter from "./routes/auth.routes";


const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

interface UserPayload {
    id: string;
    role: string;
    businessId: string
}

interface AdminPayload {
    id: string;
    role: string;
}

declare module "express" {
    interface Request {
        user?: UserPayload;
        admin?: AdminPayload
    }
}

app.use('/api', apiRoutes);
app.use('/auth', AuthRouter);
app.use('/super-admin', SuperAdminRouter);
app.use('/admin', AdminRouter);
app.use('/business', BusinessRouter);
app.use('/user', UserRouter);


export default app;