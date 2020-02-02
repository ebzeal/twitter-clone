import query from '../config/dbConnection';


import {
  addMentionsQuery,
  addTagQuery,
  tweetByIdQuery,
} from '../models/sqlQueries';

/**
 * @class TweetHelpers
 * @description Handles tweet helper methods for TweetController class
 */
class TweetHelpers {
  /**
    * @static
    * @param {string} id - the requested tweet's Id
    * @return {object} - JSON response object
    * @description - returns a single tweet whose id is listed as parameter
    * @memberof TweetHelpers
    */
  static async getTweet(id) {
    const result = await query(tweetByIdQuery, [id]);
    return result.rows[0];
  }

  /**
    * @static
    * @param {string} tweet - Tweet being referenced
    * @param {number} userId - Id of user posting the tweet
    * @param {number} savedTweetId - Id of tweet being referenced
    * @param {string} type - reply or tweet
    * @return {object} - JSON response object
    * @description - adds all mentions and tags listed in a tweet
    * @memberof TweetHelpers
    */
  static async addTagsAndMentions(tweet, userId, savedTweetId, type) {
    try {
      const tagPattern = /#\b\w+\b/g;
      const mentionPattern = /@\b\w+\b/g;

      const tags = tweet.match(tagPattern);
      const mentions = tweet.match(mentionPattern);

      let replyId, tweetId;
      if (type === 'aReply') {
        replyId = savedTweetId;
        tweetId = null;
      }
      if (type === 'aTweet') {
        replyId = null;
        tweetId = savedTweetId;
      }

      tags.map(
        async (tag) => query(addTagQuery, [userId, tweetId, replyId, tag])
      );

      mentions.map(
        async (mention) => query(addMentionsQuery, [userId, tweetId, replyId, mention])
      );
    } catch (err) {
      return err;
    }
  }
}
export default TweetHelpers;
