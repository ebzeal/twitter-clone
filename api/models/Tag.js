import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description User Collection.
 */

const tagSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: 'tweets'
  },
  reply: {
    type: Schema.Types.ObjectId,
    ref: 'replies'
  },
  tags: [
    {
      tag: {
        type: String,
      }
    }
  ],
  createdOn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('tags', tagSchema);
