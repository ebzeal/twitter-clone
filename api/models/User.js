import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description User Collection.
 */

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  userName: {
    type: String,
    required: true,
    index: { unique: true }
  },
  phone: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      dateFollowed: {
        type: Date,
        default: Date.now
      }
    }
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      dateFollowed: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

export default mongoose.model('users', userSchema);
