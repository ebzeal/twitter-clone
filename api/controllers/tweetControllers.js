import redis from 'redis';
import TweetHelpers from '../helpers/tweetHelp';
import response from '../helpers/resHelp';

import tweetDB from '../models/Tweet';

const Tweet = tweetDB;

const portRedis = process.env.REDIS_URI || 6379;

const host = process.env.NODE_ENV === 'production' ? { host: 'redis' } : null;

const redisClient = redis.createClient({ host, port: portRedis });

/**
 * @class TweetController
 * @description Handles tweet actions like post, read, reply
 */
class TweetController {
  /**
  * @static
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} - JSON response object
  * @description - posts validated tweets by registered users
  * @memberof TweetController
  */
  static async createTweet(req, res) {
    try {
      const { userId } = req.user;
      const { tweet } = req.body;

      const newTweet = new Tweet({
        user: userId,
        tweet
      });

      const savedTweet = await newTweet.save();

      await TweetHelpers.addTagsAndMentions(tweet, userId, savedTweet.id, 'aTweet');

      if (savedTweet) response(res, 201, 'success', 'Tweet has been posted', '', savedTweet);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
 * @static
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - JSON response object
 * @description - retrieves a single tweet
 * @memberof TweetController
 */
  static async readTweet(req, res) {
    try {
      const { id } = req.params;

      const tweet = await TweetHelpers.getTweet(id);

      if (tweet) redisClient.setex(id, 3600, JSON.stringify(tweet));

      return tweet ? response(res, 201, 'success', 'Tweet retrieved', '', tweet) : response(res, 404, 'failure', 'Tweet does not exist', '');
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }


  /**
 * @static
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - JSON response object
 * @description - retrieves a single tweet
 * @memberof TweetController
 */
  static async replyTweet(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const { reply } = req.body;

      const replyTweet = await Tweet.findByIdAndUpdate({ _id: id }, {
        $push: {
          reply: { user: userId, reply }
        }
      });

      await TweetHelpers.addTagsAndMentions(reply, userId, replyTweet.id, 'aReply');

      if (replyTweet) response(res, 201, 'success', 'Your reply has been added', '', replyTweet);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
 * @static
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - JSON response object
 * @description - deletes a single tweet
 * @memberof TweetController
 */
  static async deleteTweet(req, res) {
    try {
      const { id } = req.params;

      const tweet = await TweetHelpers.getTweet(id);
      if (!tweet) return response(res, 401, 'failure', 'This tweet cannot be found', '');

      const tweetId = tweet.user;

      if (tweetId == req.user.userId) {
        const isDeleted = await Tweet.deleteOne({ _id: id });

        if (isDeleted) response(res, 201, 'success', 'Tweet deleted', '');
      } else {
        return response(res, 401, 'failure', 'You cannot delete another user\'s tweet', '');
      }
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default TweetController;
