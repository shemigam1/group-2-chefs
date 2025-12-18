import { prisma } from "../../database/conn";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default class FavoritesService {
  public async addFavorite(userId: string, recipeId: string) {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

    if (recipe == null || recipe.is_deleted) {
      throw new AppError("Recipe not found", 404);
    }

    const existing = await prisma.favouriteRecipe.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing != null) {
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

  public async removeFavorite(userId: string, recipeId: string) {
    const existing = await prisma.favouriteRecipe.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing == null) {
      throw new AppError("Favorite not found", 404);
    }

    const deleted = await prisma.favouriteRecipe.delete({
      where: { id: existing.id },
    });

    return {
      id: deleted.id,
      userId: deleted.userId,
      recipeId: deleted.recipeId,
      createdAt: deleted.createdAt.toISOString(),
      updatedAt: deleted.updatedAt.toISOString(),
    };
  }

  public async listFavorites(userId: string, page = 1, limit = 10) {
    const take = Math.max(1, Math.min(100, Number(limit || 10)));
    const pageNum = Math.max(1, Number(page || 1));
    const skip = (pageNum - 1) * take;

    const [total, items] = await Promise.all([
      prisma.favouriteRecipe.count({ where: { userId } }),
      prisma.favouriteRecipe.findMany({
        where: { userId },
        include: { recipe: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    const pages = Math.ceil(total / take) || 1;

    const mapped = items.map((f) => ({
      id: f.id,
      userId: f.userId,
      recipeId: f.recipeId,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
      recipe: f.recipe && {
        id: f.recipe.id,
        userId: f.recipe.userId,
        title: f.recipe.title,
        description: f.recipe.description,
        ingredients: f.recipe.ingredients,
        instructions: f.recipe.instructions,
        cuisine_type: f.recipe.cuisine_type,
        difficulty_level: f.recipe.difficulty_level,
        tags: f.recipe.tags,
        final_img: f.recipe.final_img,
        prep_time: f.recipe.prep_time,
        cook_time: f.recipe.cook_time,
        is_deleted: f.recipe.is_deleted,
        created_at: f.recipe.created_at.toISOString(),
        updated_at: f.recipe.updated_at.toISOString(),
      },
    }));

    return {
      meta: { total, page: pageNum, limit: take, pages },
      data: mapped,
    };
  }
}
