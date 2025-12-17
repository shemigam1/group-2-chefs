import { Request, Response } from "express";
import RecipeService from "../services/classes/recipe.service";
import { RecipeResponse as IRecipeResponse } from "../types/recipe.type";

const formatRecipeResponse = (recipe: IRecipeResponse): IRecipeResponse => ({
  id: recipe.id,
  userId: recipe.userId,
  title: recipe.title,
  description: recipe.description,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  cuisine_type: recipe.cuisine_type,
  difficulty_level: recipe.difficulty_level,
  tags: recipe.tags,
  final_img: recipe.final_img,
  prep_time: recipe.prep_time,
  cook_time: recipe.cook_time,
  created_at: recipe.created_at,
  updated_at: recipe.updated_at,
  is_deleted: recipe.is_deleted,
});

export default class RecipeController {
  static async createRecipe(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user)
        return res.status(401).json({ message: "User not authenticated" });

      const recipe = await RecipeService.createRecipe(user.id, req.body);
      return res.status(201).json({
        message: "Recipe created successfully",
        data: formatRecipeResponse(recipe),
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  }

  static async updateRecipe(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user)
        return res.status(401).json({ message: "User not authenticated" });

      const recipe = await RecipeService.updateRecipe(
        req.params.recipeId,
        user.id,
        req.body
      );
      return res.status(200).json({
        message: "Recipe updated successfully",
        data: formatRecipeResponse(recipe),
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  }

  static async deleteRecipe(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (!user)
        return res.status(401).json({ message: "User not authenticated" });

      const recipe = await RecipeService.deleteRecipe(
        req.params.recipeId,
        user.id
      );
      return res.status(200).json({
        message: "Recipe deleted successfully",
        data: formatRecipeResponse(recipe),
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  }
}
