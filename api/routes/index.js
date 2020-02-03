import { Router } from 'express';

import accessMiddleware from '../middlewares/accessMiddleware';

import AuthController from '../controllers/authController';
import TweetController from '../controllers/tweetControllers';
import UserController from '../controllers/userController';

import { signUpSchema, logInSchema } from '../middlewares/validations/authValidations';
import handleValidationErrors from '../middlewares/validations/handleValidationErrors';


const route = Router();

route.get('/', (req, res) => {
  res.status(200).json('Welcome to TweetClone');
});

route.post('/auth/signup', signUpSchema, handleValidationErrors, AuthController.signUp);
route.post('/auth/login', logInSchema, handleValidationErrors, AuthController.logIn);

route.post('/tweet', accessMiddleware.authoriseUser, TweetController.createTweet);
route.get('/tweet/:id', accessMiddleware.authoriseUser, TweetController.readTweet);
route.post('/tweet/:id', accessMiddleware.authoriseUser, TweetController.replyTweet);
route.delete('/tweet/:id', accessMiddleware.authoriseUser, TweetController.deleteTweet);

route.post('/follow/:id', accessMiddleware.authoriseUser, UserController.userFollow);
route.get('/user/:id', accessMiddleware.authoriseUser, UserController.viewOwnTimeline);

export default route;
