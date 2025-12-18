import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/conn";
import { ResultFunction } from "../helpers/utils";

export const checkReviewOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const user = res.locals.user;

    if (!user) {
      const response = ResultFunction(false, "User not authenticated", 401, null);
      return res.status(response.code).json(response);
    }

    const review = await prisma.recipeReview.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      const response = ResultFunction(false, "Review not found", 404, null);
      return res.status(response.code).json(response);
    }

    if (review.userId !== user.id) {
      const response = ResultFunction(
        false,
        "You can only modify your own reviews",
        403,
        null
      );
      return res.status(response.code).json(response);
    }

    res.locals.review = review;
    next();
  } catch (error: any) {
    const response = ResultFunction(false, "Server error", 500, null);
    return res.status(response.code).json(response);
  }
};