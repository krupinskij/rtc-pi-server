import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'error.limit-exceeded',
  handler: (request, response, next, options) => {
    response
      .status(options.statusCode)
      .send({ message: request.t(options.message), authRetry: false });
  },
});
