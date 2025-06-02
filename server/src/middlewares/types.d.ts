// types/express/index.d.ts (or any global types file)
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    admin?: JwtPayload & { id: string; role: string };
  }
}
