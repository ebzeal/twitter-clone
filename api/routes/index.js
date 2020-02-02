import { Router } from 'express';

import authController from '../controllers/authController';

import { signUpSchema, logInSchema } from '../middlewares/validations/authValidations';
import handleValidationErrors from '../middlewares/validations/handleValidationErrors';


const route = Router();

route.get('/', (req, res) => {
  res.status(200).json('Welcome to TweetClone');
});

route.post('/auth/signup', signUpSchema, handleValidationErrors, authController.signUp);
route.post('/auth/login', logInSchema, handleValidationErrors, authController.logIn);

export default route;
