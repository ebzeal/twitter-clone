import { Router } from 'express';

import accessMiddleware from '../middlewares/accessMiddleware';

import AuthController from '../controllers/authController';
import TweetController from '../controllers/tweetControllers';
import UserController from '../controllers/userController';
import SearchController from '../controllers/searchController';

import { signUpSchema, logInSchema } from '../middlewares/validations/authValidations';
import handleValidationErrors from '../middlewares/validations/handleValidationErrors';
import { signupLimiter, loginLimiter } from '../config/rateLimiters';

import { cachedSearch, cachedReadTweet, cachedTimeline } from '../middlewares/cache/cachedData';


const route = Router();

route.get('/', (req, res) => {
  res.status(200).json('Welcome to TweetClone');
});

route.post('/auth/signup', signupLimiter, signUpSchema, handleValidationErrors, AuthController.signUp);
route.post('/auth/login', loginLimiter, logInSchema, handleValidationErrors, AuthController.logIn);

route.post('/tweet', accessMiddleware.authoriseUser, TweetController.createTweet);
route.get('/tweet/:id', accessMiddleware.authoriseUser, cachedReadTweet, TweetController.readTweet);
route.post('/tweet/:id', accessMiddleware.authoriseUser, TweetController.replyTweet);
route.delete('/tweet/:id', accessMiddleware.authoriseUser, TweetController.deleteTweet);

route.post('/follow/:id', accessMiddleware.authoriseUser, UserController.userFollow);
route.get('/user/:id', accessMiddleware.authoriseUser, cachedTimeline, UserController.viewOwnTimeline);

route.get('/search', accessMiddleware.authoriseUser, cachedSearch, SearchController.searchAll);

export default route;
