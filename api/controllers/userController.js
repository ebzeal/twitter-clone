import redis from 'redis';
import userDB from '../models/User';
import tweetDB from '../models/Tweet';

import response from '../helpers/resHelp';

const User = userDB;
const Tweet = tweetDB;

const portRedis = process.env.REDIS_URI || 6379;

const host = process.env.NODE_ENV === 'production' ? { host: 'redis' } : null;

const redisClient = redis.createClient({ host, port: portRedis });

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

      const isFollowed = await User.find({
        following: {
          $elemMatch: {
            user: id
          }
        }
      });

      if (isFollowed.length > 0) {
        return response(res, 409, 'failure', 'You already follow this user');
      }

      if (id === userId) {
        return response(res, 401, 'failure', 'You cannot follow yourself');
      }

      const followingObject = { user: id };

      const followUser = await User.update({ _id: userId }, {
        $push: {
          following: followingObject
        }
      });

      if (followUser) return response(res, 201, 'success', 'You just followed this user', '');
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

      if (id !== userId) {
        return response(res, 401, 'failure', 'You can only view your own timeline');
      }

      const tweets = await Tweet.find({ user: id });

      if (tweets) redisClient.setex(id, 3600, JSON.stringify(tweets));


      return tweets ? response(res, 201, 'success', 'User timeline', '', tweets) : response(res, 200, 'success', 'No tweets yet', '', tweets);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default UserController;
