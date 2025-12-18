import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller";
import {
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../controllers/favorite.controller";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  updateUserProfileValidator,
  userIdParamValidator,
  usernameParamValidator,
} from "../validators/user";
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get(
  "/:username",
  //   authMiddleware,
  joiMiddleware(usernameParamValidator, "params"),
  getUserProfile
);

userRouter.get(
  "/:userId/favorites",
  authMiddleware,
  joiMiddleware(userIdParamValidator, "params"),
  listFavorites
);

userRouter.put(
  "/:userId",
  authMiddleware,
  joiMiddleware(userIdParamValidator, "params"),
  joiMiddleware(updateUserProfileValidator, "body"),
  updateUserProfile
);

userRouter.delete(
  "/:userId",
  authMiddleware,
  joiMiddleware(userIdParamValidator, "params"),
  deleteUserAccount
);
export default userRouter;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/{userId}/favorites:
 *   get:
 *     summary: List user's favorite recipes
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of favorite recipes
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User account deleted
 *       404:
 *         description: User not found
 */
