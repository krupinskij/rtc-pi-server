import joi from 'joi';

export const cameraRegisterValidator = joi.object({
  name: joi.string().max(50).required(),
  password: joi.string().min(5).max(16).required(),
});

export const cameraAddValidator = joi.object({
  code: joi.string().length(10).required(),
  password: joi.string().min(5).max(16).required(),
});

export const cameraEditValidator = joi.object({
  newName: joi.string().max(50),
  newPassword: joi.string().min(5).max(16),
  password: joi.string().min(5).max(16).required(),
});

export const cameraRemovePermValidator = joi.object({
  password: joi.string().min(5).max(16).required(),
});
