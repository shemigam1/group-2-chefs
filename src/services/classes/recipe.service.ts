import {prisma} from "../../database/conn";
import { RecipeInput, RecipeUpdate, RecipeResponse } from "../../types/recipe.type";

export default class RecipeService {
  static async createRecipe(
    userId: string,
    data: RecipeInput
  ): Promise<RecipeResponse> {
    const {
      title,
      description,
      ingredients,
      instructions,
      cuisine_type,
      difficulty_level,
      tags,
      final_img,
      prep_time,
      cook_time,
    } = data;

    const recipe = await prisma.recipe.create({
      data: {
        userId,
        title,
        description,
        ingredients,
        instructions,
        cuisine_type,
        difficulty_level,
        tags,
        final_img,
        prep_time,
        cook_time,
      },
    });

    return recipe; 
  }

  static async updateRecipe(
    recipeId: string,
    userId: string,
    data: RecipeUpdate
  ): Promise<RecipeResponse> {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (!recipe || recipe.is_deleted) throw new Error("Not allowed");
    if (recipe.userId !== userId) throw new Error("Not allowed");

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        cuisine_type: data.cuisine_type,
        difficulty_level: data.difficulty_level,
        tags: data.tags,
        final_img: data.final_img,
        prep_time: data.prep_time,
        cook_time: data.cook_time,
      },
    });

    return updatedRecipe;
  }

  static async deleteRecipe(
    recipeId: string,
    userId: string
  ): Promise<RecipeResponse> {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (!recipe) throw new Error("Not allowed");
    if (recipe.userId !== userId) throw new Error("Not allowed");

    const deletedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: { is_deleted: true },
    });

    return deletedRecipe;
  }
}
