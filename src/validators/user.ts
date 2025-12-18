import Joi from "joi";

export const userIdParamValidator = Joi.object({
  userId: Joi.string().uuid().required(),
});

export const updateUserProfileValidator = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  profile_pic: Joi.string().uri().required(),
  bio: Joi.string().max(500).required(),
  cooking_skill_level: Joi.string().required(),
});
