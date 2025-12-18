import Joi from "joi";

// Created the review validation
export const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(500).optional().allow('').allow(null),
});

// Updated the  review validation (at least one field required)
export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().trim().max(500).optional().allow('').allow(null),
}).min(1); // At least one field must be present

// Reviewed  the  ID param validation
export const reviewIdParamSchema = Joi.object({
  reviewId: Joi.string().uuid().required(),
});

// Addtion of recipe ID param validation
export const recipeIdParamSchema = Joi.object({
  recipeId: Joi.string().uuid().required(),
});

// Flag review validation
export const flagReviewSchema = Joi.object({
  flag_reason: Joi.string().trim().min(10).max(200).required(),
});

// Query params for listing reviews
export const listReviewsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(20).optional(),
  sort: Joi.string().valid('newest', 'oldest', 'highest', 'lowest').default('newest').optional(),
});