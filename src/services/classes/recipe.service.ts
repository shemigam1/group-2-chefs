import { prisma } from "../../database/conn";
import {
  RecipeInput,
  RecipeUpdate,
  RecipeResponse,
} from "../../types/recipe.type";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default class RecipeService {
  private static mapRecipeData(data: Partial<RecipeInput>) {
    const mapped: any = {
      title: data.title ?? "",
      description: data.description ?? null,
      ingredients: data.ingredients ?? [],
      instructions: data.instructions ?? [],
      difficulty_level: data.difficulty_level ?? null,
      final_img: data.final_img ?? null,
      prep_time: data.prep_time ?? null,
      cook_time: data.cook_time ?? null,
    };

    if (data.cuisine_type && data.cuisine_type.length > 0)
      mapped.cuisine_type = data.cuisine_type;
    if (data.tags && data.tags.length > 0) mapped.tags = data.tags;

    return mapped;
  }

  static async createRecipe(
    userId: string,
    data: RecipeInput
  ): Promise<RecipeResponse> {
    if (!data.title) throw new AppError("Title is required", 400);

    const recipeData = this.mapRecipeData(data);

    const recipe = await prisma.recipe.create({
      data: {
        userId,
        ...recipeData,
      },
    });

    return {
      ...recipe,
      created_at: recipe.created_at.toISOString(),
      updated_at: recipe.updated_at.toISOString(),
    };
  }

  static async updateRecipe(
    recipeId: string,
    userId: string,
    data: RecipeUpdate
  ): Promise<RecipeResponse> {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (!recipe || recipe.is_deleted)
      throw new AppError("Recipe not found or already deleted", 404);
    if (recipe.userId !== userId)
      throw new AppError("You are not allowed to update this recipe", 403);

    const updatedData = this.mapRecipeData(data);

    Object.keys(updatedData).forEach(
      (key) =>
        updatedData[key as keyof typeof updatedData] === undefined &&
        delete updatedData[key as keyof typeof updatedData]
    );

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: updatedData,
    });

    return {
      ...updatedRecipe,
      created_at: updatedRecipe.created_at.toISOString(),
      updated_at: updatedRecipe.updated_at.toISOString(),
    };
  }

  static async deleteRecipe(
    recipeId: string,
    userId: string
  ): Promise<RecipeResponse> {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (!recipe || recipe.is_deleted)
      throw new AppError("Recipe not found or already deleted", 404);
    if (recipe.userId !== userId)
      throw new AppError("You are not allowed to delete this recipe", 403);

    const deletedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: { is_deleted: true },
    });

    return {
      ...deletedRecipe,
      created_at: deletedRecipe.created_at.toISOString(),
      updated_at: deletedRecipe.updated_at.toISOString(),
    };
  }
}
