import { prisma } from "../../database/conn";
import {
  CreateReviewInput,
  UpdateReviewInput,
  ReviewResponse,
  RatingStats,
  FlagReviewInput,
  ListReviewsQuery,
} from "../../types/review.types";

export default class ReviewService {
  // ============================================
  // 1. CREATE REVIEW
  // ============================================
  async createReview(
    userId: string,
    recipeId: string,
    input: CreateReviewInput
  ): Promise<ReviewResponse> {
    // Check if recipe exists and is not deleted
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId, is_deleted: false }
    });
    
    if (!recipe) {
      const error: any = new Error("Recipe not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if user already reviewed this recipe
    const exist = await this.checkUserReviewExists(userId, recipeId);
    if (exist) {
      const error: any = new Error("You have already reviewed this recipe");
      error.statusCode = 400;
      throw error;
    }

    // Create the review
    const review = await prisma.recipeReview.create({
      data: {
        userId,
        recipeId,
        rating: input.rating,
        comment: input.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile_pic: true,
          }
        }
      }
    });

    // Return review with user info
    return this.formatReviewResponse(review);
  }

  // ============================================
  // 2. GET REVIEW BY ID
  // ============================================
  async getReviewById(reviewId: string): Promise<ReviewResponse | null> {
    const review = await prisma.recipeReview.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile_pic: true
          }
        }
      }
    });

    return review ? this.formatReviewResponse(review) : null;
  }

  // ============================================
  // 3. GET REVIEWS BY RECIPE ID (with pagination & sorting)
  // ============================================
  async getReviewsByRecipeId(
    recipeId: string,
    query: ListReviewsQuery
  ): Promise<{ reviews: ReviewResponse[]; total: number }> {
    const { page = 1, limit = 20, sort = 'newest' } = query;
    const offset = (page - 1) * limit;

    // Determine correct orderBy based on sort type
    let orderBy: any;
    switch (sort) {
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      case 'highest':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest':
        orderBy = { rating: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { created_at: 'desc' };
    }

    // Fetch reviews and count in parallel
    const [reviews, total] = await Promise.all([
      prisma.recipeReview.findMany({
        where: { recipeId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profile_pic: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.recipeReview.count({ where: { recipeId } })
    ]);

    return {
      reviews: reviews.map(review => this.formatReviewResponse(review)),
      total
    };
  }

  // ============================================
  // 4. UPDATE REVIEW
  // ============================================
  async updateReview(
    reviewId: string,
    userId: string,
    input: UpdateReviewInput
  ): Promise<ReviewResponse> {
    const review = await prisma.recipeReview.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      const error: any = new Error("Review not found");
      error.statusCode = 404;
      throw error;
    }

    if (review.userId !== userId) {
      const error: any = new Error("You can only update your own reviews");
      error.statusCode = 403;
      throw error;
    }

    const daysSinceCreation = (Date.now() - review.created_at.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 30) {
      const error: any = new Error("Reviews can only be edited within 30 days of creation");
      error.statusCode = 403;
      throw error;
    }

    const updatedReview = await prisma.recipeReview.update({
      where: { id: reviewId },
      data: {
        rating: input.rating ?? review.rating,
        comment: input.comment !== undefined ? input.comment : review.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile_pic: true
          }
        }
      }
    });

    return this.formatReviewResponse(updatedReview);
  }

  // ============================================
  // 5. DELETE REVIEW
  // ============================================
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    // Find the review
    const review = await prisma.recipeReview.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      const error: any = new Error("Review not found");
      error.statusCode = 404;
      throw error;
    }
    if (review.userId !== userId) {
      const error: any = new Error("You can only delete your own reviews");
      error.statusCode = 403;
      throw error;
    }

    // Delete the review
    await prisma.recipeReview.delete({
      where: { id: reviewId }
    });
  }

  // ============================================
  // 6. FLAG REVIEW FOR MODERATION
  // ============================================
  async flagReview(
    reviewId: string,
    userId: string,
    input: FlagReviewInput
  ): Promise<void> {
    const review = await prisma.recipeReview.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      const error: any = new Error("Review not found");
      error.statusCode = 404;
      throw error;
    }

    if (review.userId === userId) {
      const error: any = new Error("You cannot flag your own review");
      error.statusCode = 400;
      throw error;
    }

    if (review.is_flagged) {
      const error: any = new Error("This review has already been flagged");
      error.statusCode = 400;
      throw error;
    }

    await prisma.recipeReview.update({
      where: { id: reviewId },
      data: {
        is_flagged: true,
        flag_reason: input.flag_reason
      }
    });
  }

  // ============================================
  // 7. GET RECIPE RATING STATISTICS
  // ============================================
  async getRecipeRatingStats(recipeId: string): Promise<RatingStats> {
    // Get all reviews for the recipe
    const reviews = await prisma.recipeReview.findMany({
      where: { recipeId },
      select: { rating: true }
    });

    const total_reviews = reviews.length;
    if (total_reviews === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }

    // Calculate average rating
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average_rating = sum / total_reviews;

    // Calculate rating distribution
    const rating_distribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    };

    return {
      average_rating: Math.round(average_rating * 10) / 10, // Round to 1 decimal
      total_reviews,
      rating_distribution
    };
  }

  // ============================================
  // 8. CHECK IF USER ALREADY REVIEWED RECIPE
  // ============================================
  async checkUserReviewExists(
    userId: string,
    recipeId: string
  ): Promise<boolean> {
    const review = await prisma.recipeReview.findFirst({
      where: {
        userId,
        recipeId
      }
    });
    
    return !!review;
  }

  // ============================================
  // HELPER: Format review response with user info
  // ============================================
  private formatReviewResponse(review: any): ReviewResponse {
    return {
      id: review.id,
      userId: review.userId,
      recipeId: review.recipeId,
      rating: review.rating,
      comment: review.comment,
      helpful_count: review.helpful_count,
      is_flagged: review.is_flagged,
      flag_reason: review.flag_reason,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user: {
        id: review.user.id,
        username: review.user.username,
        profile_pic: review.user.profile_pic,
      },
    };
  }
}