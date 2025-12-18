import { Request, Response } from "express";
import { ResultFunction } from "../helpers/utils";
import User from "../services/classes/user.service";

export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await new User().findUserProfileById(userId);

  if (!user) {
    const data = ResultFunction(false, "User not found", 404, null);
    return res.status(data.code).json(data);
  }

  const data = ResultFunction(true, "User profile fetched", 200, user);
  return res.status(data.code).json(data);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const updates = {
    username: req.body.username,
    email: req.body.email,
    profile_pic: req.body.profile_pic,
    bio: req.body.bio,
    cooking_skill_level: req.body.cooking_skill_level,
  };

  const user = await new User().updateUserProfileById(userId, updates);

  if (!user) {
    const data = ResultFunction(false, "User update failed", 400, null);
    return res.status(data.code).json(data);
  }

  const data = ResultFunction(true, "User profile updated", 200, user);
  return res.status(data.code).json(data);
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await new User().softDeleteUserById(userId);

  if (!user) {
    const data = ResultFunction( false, "user delete failed", 400, null);
    return res.status(data.code).json(data);
  }

  const data = ResultFunction( true, "user account deleted", 200, user);
  return res.status(data.code).json(data);
}