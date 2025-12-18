import { Request, Response } from "express";
import { favoritesFactory } from "../services/factories";

export async function addFavorite(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (user == null) return res.status(401).json({ message: "User not authenticated" });

    const favorite = await favoritesFactory().addFavorite(
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

export async function removeFavorite(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (user == null) return res.status(401).json({ message: "User not authenticated" });

    const removed = await favoritesFactory().removeFavorite(
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

export async function listFavorites(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (user == null) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.params.userId;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await favoritesFactory().listFavorites(userId, page, limit);

    return res.status(200).json({ message: "Favorites retrieved", ...result });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

