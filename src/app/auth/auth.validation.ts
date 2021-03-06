import joi from 'joi';

export const loginValidator = joi.object({
  email: joi.string().email({ tlds: false }).max(25).required(),
  password: joi.string().min(5).max(16).required(),
});

export const registerValidator = joi.object({
  email: joi.string().email({ tlds: false }).max(25).required(),
  password: joi.string().min(5).max(16).required(),
});
