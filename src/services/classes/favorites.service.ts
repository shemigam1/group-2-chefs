import { prisma } from "../../database/conn";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default class FavoritesService {
  static async addFavorite(userId: string, recipeId: string) {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (!recipe || recipe.is_deleted) {
      throw new AppError("Recipe not found", 404);
    }

    const existing = await prisma.favouriteRecipe.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing) {
      throw new AppError("Recipe already favorited", 400);
    }

    const fav = await prisma.favouriteRecipe.create({
      data: { userId, recipeId },
    });

    return {
      id: fav.id,
      userId: fav.userId,
      recipeId: fav.recipeId,
      createdAt: fav.createdAt.toISOString(),
      updatedAt: fav.updatedAt.toISOString(),
    };
  }
}
