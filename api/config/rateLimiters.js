/* eslint-disable indent */
import rateLimit from 'express-rate-limit';

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message:
        'Too many sign up attempts from this IP, please try again after an hour',
});

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message:
        'Too many login attempts from this IP, please try again after an hour',
});

const readLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message:
        'Too many requests from this IP, please try again after an hour',
});

export {
    signupLimiter,
    loginLimiter,
    readLimiter,
};
