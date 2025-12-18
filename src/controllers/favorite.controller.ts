import { Request, Response } from "express";
import FavoritesService from "../services/classes/favorites.service";

export default class FavoriteController {
  static async addFavorite(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (user == null) return res.status(401).json({ message: "User not authenticated" });

      const favorite = await FavoritesService.addFavorite(
        user.id,
        req.params.recipeId
      );

      return res
        .status(201)
        .json({ message: "Recipe added to favorites", data: favorite });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  }

  static async removeFavorite(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      if (user == null) return res.status(401).json({ message: "User not authenticated" });

      const removed = await FavoritesService.removeFavorite(
        user.id,
        req.params.recipeId
      );

      return res
        .status(200)
        .json({ message: "Recipe removed from favorites", data: removed });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  }
}
