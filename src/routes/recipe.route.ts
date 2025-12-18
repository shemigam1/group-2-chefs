import { Router } from "express";
import { createRecipe, updateRecipe, deleteRecipe, listRecipes, getRecipeById } from "../controllers/receipe.controller";
import { addFavorite, removeFavorite, listFavorites } from "../controllers/favorite.controller";
import authMiddleware from "../middlewares//authMiddleware";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
	createRecipeSchema,
	updateRecipeSchema,
	listRecipesSchema,
	recipeIdParamSchema,
} from "../validators/recipevalidator";

const router = Router();


router.post(
	"/",
	authMiddleware,
	joiMiddleware(createRecipeSchema),
	createRecipe
);


router.put(
	"/:recipeId",
	authMiddleware,
	joiMiddleware(updateRecipeSchema),
	updateRecipe
);


router.delete("/:recipeId", authMiddleware, deleteRecipe);

// Add/Remove favorites
router.post(
	"/:recipeId/favorite",
	authMiddleware,
	addFavorite
);
router.delete(
	"/:recipeId/favorite",
	authMiddleware,
	removeFavorite
);


router.get(
	"/",
	authMiddleware,
	joiMiddleware(listRecipesSchema, "query"),
	listRecipes
);


router.get(
	"/:recipeId",
	authMiddleware,
	joiMiddleware(recipeIdParamSchema, "params"),
	getRecipeById
);

export default router;

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
