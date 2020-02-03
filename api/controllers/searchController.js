import query from '../config/dbConnection';
import response from '../helpers/resHelp';
import { searchTweetQuery, searchUserQuery } from '../models/sqlQueries';

/**
 * @class SearchController
 * @description Handles user and tweet searches
 */
class SearchController {
  /**
  * @static
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} - JSON response object
  * @description - search keyword in users and tweets
  * @memberof SearchController
  */
  static async searchAll(req, res) {
    try {
      const { keyword } = req.query;
      const searchTweets = await query(searchTweetQuery, [keyword]);
      const searchUsers = await query(searchUserQuery, [keyword]);

      const searchResult = { Tweets: [searchTweets.rows], Users: [searchUsers.rows] };
      return (searchTweets.rowCount > 0 || searchUsers.rowCount > 0)
        ? response(res, 201, 'success', `All results with the keyword '${keyword}' `, '', searchResult)
        : response(res, 404, 'failure', 'No Search found', '');
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default SearchController;
