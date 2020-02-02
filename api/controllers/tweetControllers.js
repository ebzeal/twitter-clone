import query from '../config/dbConnection';
import TweetHelpers from '../helpers/tweetHelpers';
import response from '../helpers/resHelp';

import {
  addTweetQuery,
  addReplyQuery,
  deleteTweetQuery
} from '../models/sqlQueries';

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
      console.log('TCL: TweetController -> createTweet -> userId', userId);
      const { tweet } = req.body;

      const { rows } = await query(addTweetQuery, [userId, tweet]);
      console.log('TCL: TweetController -> createTweet -> rows', rows[0]);

      const savedTweet = await TweetHelpers.getTweet(rows[0].id);
      console.log('TCL: TweetController -> createTweet -> savedTweet', savedTweet);

      await TweetHelpers.addTagsAndMentions(tweet, userId, savedTweet.id, 'aTweet');

      if (savedTweet) response(res, 201, 'success', 'Tweet has been posted', '', rows[0]);
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

      const { rows } = await query(addReplyQuery, [userId, id, reply]);

      await TweetHelpers.addTagsAndMentions(reply, userId, rows[0].id, 'aReply');

      const tweet = rows[0];

      if (tweet) response(res, 201, 'success', 'Your reply has been added', '', tweet);
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

      if (tweet.user_id === req.user.userId) {
        const isDeleted = await query(deleteTweetQuery, [id]);

        if (isDeleted.rowCount > 0) response(res, 201, 'success', 'Tweet deleted', '');
      } else {
        return response(res, 401, 'failure', 'You cannot delete another user\'s tweet', '');
      }
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
}

export default TweetController;
