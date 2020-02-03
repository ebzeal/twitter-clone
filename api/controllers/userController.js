import query from '../config/dbConnection';
import response from '../helpers/resHelp';
import { followUserQuery, searchFollowerQuery, getUserTweetsQuery } from '../models/sqlQueries';

/**
 * @class UserController
 * @description Handles user following andtimelines
 */
class UserController {
  /**
  * @static
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} - JSON response object
  * @description - follow a particular user
  * @memberof UserController
  */
  static async userFollow(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      const isFollowed = await query(searchFollowerQuery, [userId, id]);
      if (isFollowed.rowCount > 0) {
        return response(res, 409, 'failure', 'You already follow this user');
      }

      if (parseInt(id, 10) === userId) {
        return response(res, 401, 'failure', 'You cannot follow yourself');
      }

      const { rows } = await query(followUserQuery, [userId, id]);

      if (rows.length > 0) response(res, 201, 'success', 'You just followed this user', '', rows[0]);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
 * @static
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - JSON response object
 * @description - retrieves user's timeline
 * @memberof UserController
 */
  static async viewOwnTimeline(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      if (parseInt(id, 10) !== userId) {
        return response(res, 401, 'failure', 'You can only view your own timeline');
      }

      const tweets = await query(getUserTweetsQuery, [id]);

      return tweets.rowCount > 0 ? response(res, 201, 'success', 'User timeline', '', tweets.rows) : response(res, 200, 'success', 'No tweets yet', '', tweets.rowCount);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default UserController;
