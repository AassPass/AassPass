import express from "express";
import cors from "cors";


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

// app.use('/api', apiRoutes);
// app.use('/auth', authRouter);
// app.use('/restaurant', restaurantRouter);
// app.use('/menu', menuRouter);

export default app;