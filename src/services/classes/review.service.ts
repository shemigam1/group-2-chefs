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
    // TODO: Check if recipe exists and is not deleted
    // TODO: Check if user already reviewed this recipe
    // TODO: Create the review
    // TODO: Return review with user info
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 2. GET REVIEW BY ID
  // ============================================
  async getReviewById(reviewId: string): Promise<ReviewResponse | null> {
    // TODO: Find review by ID with user info
    // TODO: Return null if not found
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 3. GET REVIEWS BY RECIPE ID (with pagination & sorting)
  // ============================================
  async getReviewsByRecipeId(
    recipeId: string,
    query: ListReviewsQuery
  ): Promise<{ reviews: ReviewResponse[]; total: number }> {
    // TODO: Get reviews with pagination
    // TODO: Apply sorting (newest, oldest, highest, lowest)
    // TODO: Include user info
    // TODO: Return reviews + total count
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 4. UPDATE REVIEW
  // ============================================
  async updateReview(
    reviewId: string,
    userId: string,
    input: UpdateReviewInput
  ): Promise<ReviewResponse> {
    // TODO: Find review
    // TODO: Check ownership (user can only update their own review)
    // TODO: Check if review is within 30 days (PRD requirement)
    // TODO: Update review
    // TODO: Return updated review with user info
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 5. DELETE REVIEW
  // ============================================
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    // TODO: Find review
    // TODO: Check ownership
    // TODO: Delete review
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 6. FLAG REVIEW FOR MODERATION
  // ============================================
  async flagReview(
    reviewId: string,
    userId: string,
    input: FlagReviewInput
  ): Promise<void> {
    // TODO: Find review
    // TODO: Check user is not flagging their own review
    // TODO: Update is_flagged and flag_reason
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 7. GET RECIPE RATING STATISTICS
  // ============================================
  async getRecipeRatingStats(recipeId: string): Promise<RatingStats> {
    // TODO: Calculate average rating
    // TODO: Get total review count
    // TODO: Calculate rating distribution (how many 1-star, 2-star, etc.)
    throw new Error("Not implemented yet");
  }

  // ============================================
  // 8. CHECK IF USER ALREADY REVIEWED RECIPE
  // ============================================
  async checkUserReviewExists(
    userId: string,
    recipeId: string
  ): Promise<boolean> {
    // TODO: Check if review exists
    throw new Error("Not implemented yet");
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