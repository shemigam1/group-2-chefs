import { Router } from "express";
import RecipeController from "../controllers/receipe.controller";
import FavoriteController from "../controllers/favorite.controller";
import authMiddleware from "../middlewares//authMiddleware";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
	createRecipeSchema,
	updateRecipeSchema,
	listRecipesSchema,
	recipeIdParamSchema,
} from "../validators/recipevalidator";

const router = Router();

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - ingredients
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *               cuisine_type:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty_level:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               prep_time:
 *                 type: integer
 *               cook_time:
 *                 type: integer
 *               final_img:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
	"/",
	authMiddleware,
	joiMiddleware(createRecipeSchema),
	RecipeController.createRecipe
);

/**
 * @swagger
 * /recipes/{recipeId}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipe to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *               cuisine_type:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty_level:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               prep_time:
 *                 type: integer
 *               cook_time:
 *                 type: integer
 *               final_img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       403:
 *         description: Not allowed
 *       401:
 *         description: Unauthorized
 */
router.put(
	"/:recipeId",
	authMiddleware,
	joiMiddleware(updateRecipeSchema),
	RecipeController.updateRecipe
);

/**
 * @swagger
 * /recipes/{recipeId}:
 *   delete:
 *     summary: Soft delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipe to delete
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       403:
 *         description: Not allowed
 *       401:
 *         description: Unauthorized
 */
router.delete("/:recipeId", authMiddleware, RecipeController.deleteRecipe);

// Add/Remove favorites
router.post(
	"/:recipeId/favorite",
	authMiddleware,
	FavoriteController.addFavorite
);
router.delete(
	"/:recipeId/favorite",
	authMiddleware,
	FavoriteController.removeFavorite
);

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: List all recipes with pagination
 *     tags: [Recipes]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Paginated list of recipes
 */
router.get(
	"/",
	authMiddleware,
	joiMiddleware(listRecipesSchema, "query"),
	RecipeController.listRecipes
);

/**
 * @swagger
 * /recipes/{recipeId}:
 *   get:
 *     summary: Get recipe details by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe details
 *       404:
 *         description: Recipe not found
 */
router.get(
	"/:recipeId",
	authMiddleware,
	joiMiddleware(recipeIdParamSchema, "params"),
	RecipeController.getRecipeById
);

export default router;
