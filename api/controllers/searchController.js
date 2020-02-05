import redis from 'redis';

import response from '../helpers/resHelp';
import Tweet from '../models/Tweet';
import User from '../models/User';

const portRedis = process.env.REDIS_URI || 6379;

const host = process.env.NODE_ENV === 'production' ? { host: 'redis' } : null;

const redisClient = redis.createClient({ host, port: portRedis });

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
      const searchKey = RegExp(keyword, 'i');
      const searchTweets = await Tweet.find({
        $or: [
          { tweet: searchKey },
          {
            reply: {
              $elemMatch: {
                reply: searchKey
              }
            }
          }

        ]
      });

      const searchUsers = await User.find({
        $or: [
          { email: searchKey },
          { userName: searchKey }

        ]
      });

      const searchResult = { Tweets: [searchTweets], Users: [searchUsers] };

      redisClient.setex(keyword, 3600, JSON.stringify(searchResult));

      return (searchTweets || searchUsers)
        ? response(res, 201, 'success', `All results with the keyword '${keyword}' `, '', searchResult)
        : response(res, 404, 'failure', 'No Search found', '');
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default SearchController;
