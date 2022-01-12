import joi from 'joi';

export const editUserValidator = joi.object({
  newPassword: joi.string().min(5).max(16).required(),
  password: joi.string().min(5).max(16).required(),
});
