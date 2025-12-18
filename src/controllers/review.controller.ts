import { Request, Response } from "express";
import ReviewService from "../services/classes/review.service";
import { ResultFunction } from "../helpers/utils";

const reviewService = new ReviewService();

export default class ReviewController {
  // ============================================
  // CREATE REVIEW
  // ============================================
  static async createReview(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user) {
        const response = ResultFunction(false, "User not authenticated", 401, null);
        return res.status(response.code).json(response);
      }

      const { recipeId } = req.params;
      const review = await reviewService.createReview(user.id, recipeId, req.body);

      const response = ResultFunction(
        true,
        "Review created successfully",
        201,
        review
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // GET REVIEW BY ID
  // ============================================
  static async getReviewById(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const review = await reviewService.getReviewById(reviewId);

      if (!review) {
        const response = ResultFunction(false, "Review not found", 404, null);
        return res.status(response.code).json(response);
      }

      const response = ResultFunction(
        true,
        "Review fetched successfully",
        200,
        review
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // GET REVIEWS BY RECIPE ID (with pagination)
  // ============================================
  static async getReviewsByRecipeId(req: Request, res: Response) {
    try {
      const { recipeId } = req.params;
      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        sort: (req.query.sort as 'newest' | 'oldest' | 'highest' | 'lowest') || 'newest'
      };

      const result = await reviewService.getReviewsByRecipeId(recipeId, query);

      const response = ResultFunction(
        true,
        "Reviews fetched successfully",
        200,
        {
          reviews: result.reviews,
          meta: {
            total: result.total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(result.total / query.limit)
          }
        }
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // UPDATE REVIEW
  // ============================================
  static async updateReview(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user) {
        const response = ResultFunction(false, "User not authenticated", 401, null);
        return res.status(response.code).json(response);
      }

      const { reviewId } = req.params;
      const review = await reviewService.updateReview(reviewId, user.id, req.body);

      const response = ResultFunction(
        true,
        "Review updated successfully",
        200,
        review
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // DELETE REVIEW
  // ============================================
  static async deleteReview(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user) {
        const response = ResultFunction(false, "User not authenticated", 401, null);
        return res.status(response.code).json(response);
      }

      const { reviewId } = req.params;
      await reviewService.deleteReview(reviewId, user.id);

      const response = ResultFunction(
        true,
        "Review deleted successfully",
        200,
        null
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // FLAG REVIEW
  // ============================================
  static async flagReview(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user) {
        const response = ResultFunction(false, "User not authenticated", 401, null);
        return res.status(response.code).json(response);
      }

      const { reviewId } = req.params;
      await reviewService.flagReview(reviewId, user.id, req.body);

      const response = ResultFunction(
        true,
        "Review flagged for moderation",
        200,
        null
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }

  // ============================================
  // GET RECIPE RATING STATISTICS
  // ============================================
  static async getRecipeRatingStats(req: Request, res: Response) {
    try {
      const { recipeId } = req.params;
      const stats = await reviewService.getRecipeRatingStats(recipeId);

      const response = ResultFunction(
        true,
        "Rating statistics fetched successfully",
        200,
        stats
      );
      return res.status(response.code).json(response);
    } catch (err: any) {
      const response = ResultFunction(
        false,
        err.message,
        err.statusCode || 500,
        null
      );
      return res.status(response.code).json(response);
    }
  }
}