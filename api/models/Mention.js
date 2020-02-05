import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description User Collection.
 */

const mentionSchema = new Schema({
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
  mentions: [
    {
      mention: {
        type: String,
      }
    }
  ],
  createdOn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('mentions', mentionSchema);
