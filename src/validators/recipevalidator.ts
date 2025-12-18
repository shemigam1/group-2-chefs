import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().optional(),
  ingredients: Joi.array().items(Joi.string().trim()).min(1).required(),
  instructions: Joi.array().items(Joi.string().trim()).min(1).required(),
  cuisine_type: Joi.array().items(Joi.string().trim()).optional(),
  difficulty_level: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  final_img: Joi.string().uri().optional(),
  prep_time: Joi.number().integer().min(0).optional(),
  cook_time: Joi.number().integer().min(0).optional(),
});

export const updateRecipeSchema = createRecipeSchema.fork(
  Object.keys(createRecipeSchema.describe().keys),
  (field) => field.optional()
);

export const listRecipesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(20).optional(),
  cuisine_type: Joi.string().trim().optional(),
  difficulty_level: Joi.string().trim().optional(),
  tags: Joi.string().trim().optional(),
});

export const recipeIdParamSchema = Joi.object({
  recipeId: Joi.string().uuid().required(),
});