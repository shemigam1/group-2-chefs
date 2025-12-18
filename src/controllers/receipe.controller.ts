import { Request, Response } from "express";
import RecipeService from "../services/classes/recipe.service";
import { RecipeResponse as IRecipeResponse } from "../types/recipe.type";
import { prisma } from "../database/conn";

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

  //get all recipes
  static async listRecipes(req: Request, res:Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      // const filters = {
      //   cuisine_type: req.query.cuisine_type as string | undefined,
      //   difficulty_level: req.query.difficulty_level as string | undefined,
      //   tags: req.query.tags as string | undefined,
      // };

      const recipes = await prisma.recipe.findMany({
        where: { is_deleted: false },
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
      }); 

      const total = await prisma.recipe.count({ where: { is_deleted: false } });
      return res.status(200).json({
        message: "Recipes fetched successfully",
        data: recipes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err: any) {
      console.error(err);
      res.status(err.statusCode || 500).json({ message: "Server error" });
    }
  }

  // get recipe by id
  static async getRecipeById(req: Request, res: Response) {
  try {
    const recipeId = req.params.recipeId;
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId, is_deleted: false },
      include:{
        reviews: true,
        favouriteRecipes: true,
      },
    });
    if(!recipe || recipe.is_deleted){
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (err: any) {
    console.error(err);
    return res.status(err.statusCode || 500).json({ message: "Server error" });
  }
}
  
}