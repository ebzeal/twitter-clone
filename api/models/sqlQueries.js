/* eslint-disable indent */
const queryUserByEmail = 'SELECT * FROM users WHERE email=$1';
const queryUserByName = 'SELECT * FROM users WHERE userName=$1';
const queryUserByPhone = 'SELECT * FROM users WHERE phone=$1';
const queryInsertUser = `INSERT INTO
users(email, userName, phone, password)
VALUES($1, $2, $3, $4)
returning *`;
const queryUser = 'SELECT * FROM users WHERE email=$1 OR userName=$1 or phone=$1';
const queryUsers = 'SELECT * FROM users';
const queryUserById = 'SELECT * FROM users WHERE id=$1';

const addTweetQuery = 'INSERT INTO tweets(user_id, tweet)VALUES($1, $2) returning *';
const addTagQuery = 'INSERT INTO tags(user_id, tweet_id, reply_id, tag)VALUES($1, $2, $3, $4)';
const addMentionsQuery = 'INSERT INTO mentions(user_id, tweet_id, reply_id, mention)VALUES($1, $2, $3, $4)';
const tweetByIdQuery = 'SELECT * FROM tweets WHERE id=$1';
const addReplyQuery = 'INSERT INTO replies(user_id, tweet_id, tweet_reply)VALUES($1, $2, $3) returning *';
const deleteTweetQuery = 'DELETE FROM tweets WHERE id=$1';


export {
  queryUserByEmail,
  queryUserByName,
  queryUserByPhone,
  queryInsertUser,
  queryUser,
  queryUsers,
  queryUserById,
  addTweetQuery,
  addTagQuery,
  addMentionsQuery,
  tweetByIdQuery,
  addReplyQuery,
  deleteTweetQuery
};
