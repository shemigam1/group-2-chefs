// types/express.d.ts
import { User } from "../database/conn";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
