import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100, 
    message: 'more than 100 requests, please try again later.'
});