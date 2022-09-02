import mongoose, { Schema, model } from 'mongoose';

const PostSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Text is required.'],
  },
  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  likes: [
    {
      type: Schema.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      _id: { type: String, required: true },
      text: {
        type: String,
        required: [true, 'Text is required.'],
      },
      created: { type: Date, default: Date.now },
      postedBy: { type: Schema.ObjectId, ref: 'User' },
    },
  ],
  postedBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post ||
  mongoose.model('Post', PostSchema);
