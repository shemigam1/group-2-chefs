import { Router } from "express";
import RecipeController from "../controllers/receipe.controller";
import authMiddleware from "../middlewares/authMiddleware";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "../validators/recipevalidator";

const router = Router();

// Create recipe
router.post(
  "/",
  authMiddleware,
  joiMiddleware(createRecipeSchema, "body"),
  RecipeController.createRecipe
);

// Update recipe
router.put(
  "/:recipeId",
  authMiddleware,
  joiMiddleware(updateRecipeSchema, "body"),
  RecipeController.updateRecipe
);

// Soft delete recipe
router.delete("/:recipeId", authMiddleware, RecipeController.deleteRecipe);

export default router;
