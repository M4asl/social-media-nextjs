import mongoose, { Schema, model } from 'mongoose';

const ChatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [{ type: Schema.ObjectId, ref: 'User' }],
    latestMessage: {
      type: Schema.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chat ||
  mongoose.model('Chat', ChatSchema);
