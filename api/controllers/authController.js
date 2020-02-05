/* eslint-disable max-len */
import userDB from '../models/User';
import tokenHelp from '../helpers/tokenHelp';
import passwordHelp from '../helpers/passwordHelp';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';
import UserHelp from '../helpers/userHelp';

const User = userDB;

/**
 * @class authController
 */
class AuthController {
  /**
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} A JSON Response object
   * @memberof authController
   */
  static async signUp(req, res) {
    try {
      const inputObj = UtilHelp.cleanInput(req.body);

      const { email, userName, phone } = inputObj;

      const foundUser = await UserHelp.findUser(userName, email, phone);

      if (foundUser !== null) {
        if (foundUser.userName === userName) {
          return response(res, 400, 'failure', 'This username already exists');
        }

        if (foundUser.email === email) {
          return response(res, 400, 'failure', 'Another user is registered with this email');
        }

        if (foundUser.phone === phone) {
          return response(res, 400, 'failure', 'This phone number is registered with another user');
        }
        return response(res, 400, 'failure', 'This user already exists');
      }


      const hashedPassword = await passwordHelp.hashPassword(req.body.password);

      const newUser = new User({
        email,
        userName,
        phone,
        password: hashedPassword
      });

      const createdUser = await newUser.save();

      const payload = {
        userId: createdUser.id,
        userName: createdUser.userName,
        userEmail: createdUser.email,
        userPhone: createdUser.phone
      };

      const token = await tokenHelp.sign(payload);

      return response(res, 201, 'success', 'Account created successfully', '', token);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof authController
   */
  static async logIn(req, res) {
    try {
      const inputObj = UtilHelp.cleanInput(req.body);

      const { user } = inputObj;

      // const foundUser = await UserHelp.findUser(user, user, user);

      const foundUser = await User.findOne({
        $or: [
          {
            userName: user
          },
          {
            email: user
          },
          {
            phone: user
          }
        ]
      });


      if (foundUser === null) {
        return response(res, 404, 'failure', 'Your login information is not correct');
      }
      const isValidPassword = passwordHelp.verifyPassword(req.body.password, foundUser.password);

      if (!isValidPassword) {
        return response(res, 401, 'failure', 'Your login information is not correct');
      }

      const payload = {
        userId: foundUser.id,
        userName: foundUser.userName,
        userEmail: foundUser.email,
        phone: foundUser.phone
      };

      const token = tokenHelp.sign(payload);
      return response(res, 200, 'success', 'You have successfully logged in', '', token);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default AuthController;
