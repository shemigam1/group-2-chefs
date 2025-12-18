import { Router } from "express";
import {
	getUserProfile,
	updateUserProfile,
	deleteUserAccount,
} from "../controllers/user.controller";
import { addFavorite, removeFavorite, listFavorites } from "../controllers/favorite.controller";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
	updateUserProfileValidator,
	userIdParamValidator,
} from "../validators/user";
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = Router();



userRouter.get(
	"/:userId",
	authMiddleware,
	joiMiddleware(userIdParamValidator, "params"),
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
