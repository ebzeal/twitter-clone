import tokenHelp from '../helpers/tokenHelp';
import response from '../helpers/resHelp';

/**
 * @class accessMiddleware
 * @description class contains function for implementing Authentication middleware
 */
class accessMiddleware {
  /**
   * @static
   * @description a middleware function checking if a user is authenticated
   * @param {object} req HTTP request object
   * @param {object} res HTTP response object
   * @param {function} next next middleware function
   * @returns {object} returns error message if user is not authenticated
   */
  static async authoriseUser(req, res, next) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return response(res, 401, 'failure', 'You are not logged in.');
      }

      const token = authorization.split(' ')[1];

      const decoded = tokenHelp.verify(token);

      if (decoded) {
        req.user = decoded;
        return next();
      }
    } catch (error) {
      const { name } = error;
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError') {
        return response(res, 401, 'failure', 'You need to log in again.');
      }
      return response(res, 500, 'failure', 'An error occured on the server', error.message);
    }
  }

  /**
   * @static
   * @description - a middleware that checks if the user is an admin
   * @param {object} req - a request object
   * @param {object} res - a response object
   * @param {object} next - the next middleware function
   * @returns {object} - a message whether the user is an admin or not
   * @memberof accessMiddleware
   */
  static adminAccess(req, res, next) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return response(res, 401, 'failure', 'You are not logged in.');
      }

      const token = authorization.split(' ')[1];
      const decoded = tokenHelp.verify(token);
      if (decoded) {
        req.user = decoded;
      }

      const { access } = req.user;
      if (access !== 'Admin') return response(res, 401, 'failure', 'You are unauthorised to access this page.');

      return next();
    } catch (error) {
      const { name } = error;
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError') {
        return response(res, 401, 'failure', 'You need to log in again.');
      }

      return response(res, 500, 'failure', 'An error occured on the server', error);
    }
  }
}

export default accessMiddleware;
