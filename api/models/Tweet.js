import mongoose from 'mongoose';

import User from './User';

const { Schema } = mongoose;

/**

 *
 * @description User Collection.
 */

const tweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  tweet: {
    type: String,
    required: true
  },
  reply: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      reply: {
        type: String
      },
    }
  ],
  createdOn: {
    type: Date,
    default: Date.now
  }
});

tweetSchema.post('remove', (document) => {
  const userId = user._id;
  User.find({ id: { $in: [userId] } }).then((users) => {
    Promise.all(
      users.map((user) => User.findOneAndUpdate(
        user._id,
        { $pull: { roles: userId } },
        { new: true }
      ))
    );
  });
});

export default mongoose.model('tweets', tweetSchema);
