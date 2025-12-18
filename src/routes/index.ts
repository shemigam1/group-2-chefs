import { NextFunction, Request, Response, Router } from "express";
import { ResultFunction } from "../helpers/utils";
// import { ReturnStatus } from "../types/generic";
// import authMiddleWare from "../middlewares/authMiddleware";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import recipeRouter from "./recipe.route";


const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
// recipe routes
apiRouter.use("/recipes", recipeRouter);


// Health check
apiRouter.get("/health", (req: Request, res: Response) => {
  const data = ResultFunction(
    true,
    "Welcome to group-2-chefs v1.0. Cooking has begun!",
    200,
    null
  );
  return res.status(data.code).json(data);
});

// Fallback route (optional)
apiRouter.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: true,
    message: "Route not found",
  });
});

export default apiRouter;
