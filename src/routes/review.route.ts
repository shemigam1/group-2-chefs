import { Router } from "express";
import ReviewController from "../controllers/review.controller";
import authMiddleware from "../middlewares/authMiddleware";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
  recipeIdParamSchema,
  flagReviewSchema,
  listReviewsQuerySchema,
} from "../validators/review.validator";

const reviewRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Recipe review and rating management
 */

// ============================================
// RECIPE-SPECIFIC REVIEW ROUTES
// ============================================

/**
 * @swagger
 * /recipes/{recipeId}/reviews:
 *   post:
 *     summary: Create a review for a recipe
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error or duplicate review
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */
reviewRouter.post(
  "/recipes/:recipeId/reviews",
  authMiddleware,
  joiMiddleware(recipeIdParamSchema, "params"),
  joiMiddleware(createReviewSchema, "body"),
  ReviewController.createReview
);

/**
 * @swagger
 * /recipes/{recipeId}/reviews:
 *   get:
 *     summary: Get all reviews for a recipe
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, highest, lowest]
 *           default: newest
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 */
reviewRouter.get(
  "/recipes/:recipeId/reviews",
  joiMiddleware(recipeIdParamSchema, "params"),
  joiMiddleware(listReviewsQuerySchema, "query"),
  ReviewController.getReviewsByRecipeId
);

/**
 * @swagger
 * /recipes/{recipeId}/ratings:
 *   get:
 *     summary: Get rating statistics for a recipe
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating statistics fetched successfully
 */
reviewRouter.get(
  "/recipes/:recipeId/ratings",
  joiMiddleware(recipeIdParamSchema, "params"),
  ReviewController.getRecipeRatingStats
);

// ============================================
// REVIEW-SPECIFIC ROUTES
// ============================================

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review fetched successfully
 *       404:
 *         description: Review not found
 */
reviewRouter.get(
  "/reviews/:reviewId",
  joiMiddleware(reviewIdParamSchema, "params"),
  ReviewController.getReviewById
);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update your own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Not authorized or review too old
 *       404:
 *         description: Review not found
 */
reviewRouter.put(
  "/reviews/:reviewId",
  authMiddleware,
  joiMiddleware(reviewIdParamSchema, "params"),
  joiMiddleware(updateReviewSchema, "body"),
  ReviewController.updateReview
);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete your own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
reviewRouter.delete(
  "/reviews/:reviewId",
  authMiddleware,
  joiMiddleware(reviewIdParamSchema, "params"),
  ReviewController.deleteReview
);

/**
 * @swagger
 * /reviews/{reviewId}/flag:
 *   post:
 *     summary: Flag a review for moderation
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flag_reason
 *             properties:
 *               flag_reason:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *     responses:
 *       200:
 *         description: Review flagged successfully
 *       400:
 *         description: Cannot flag own review or already flagged
 *       404:
 *         description: Review not found
 */
reviewRouter.post(
  "/reviews/:reviewId/flag",
  authMiddleware,
  joiMiddleware(reviewIdParamSchema, "params"),
  joiMiddleware(flagReviewSchema, "body"),
  ReviewController.flagReview
);

export default reviewRouter;