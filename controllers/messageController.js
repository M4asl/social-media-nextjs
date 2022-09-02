import Chat from '../models/chatModel';
import Message from '../models/messageModel.js';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';

const createMessage = catchAsync(async (req, res, next) => {
  if (!req.body.content || !req.body.chatId) {
    return next(
      new AppError('Invalid data passed into request', 400)
    );
  }

  const newMessage = {
    sender: req.user._id,
    content: req.body.content,
    chat: req.body.chatId,
  };

  let message = await Message.create(newMessage);
  // message = await message
  //   .populate('sender', '_id name')
  //   .populate('readBy', '_id name photo')
  //   .populate('chat')
  //   .execPopulate();
  // message = await User.populate(message, {
  //   path: 'chat.users',
  //   select: '_id name photo',
  // });

  await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message,
  });

  res.status(201).json(message);
});

const getMessagesByChatId = catchAsync(async (req, res, next) => {
  const { messagePageNumber } = req.query;
  const number = Number(messagePageNumber);
  const size = 20;
  let messages;
  if (number === 1) {
    messages = await Message.find({
      chat: req.query.id,
    })
      .limit(size)
      .populate('sender', '_id name photo')
      .populate('readBy', '_id name photo')
      .sort('-createdAt')
      .exec();
  } else {
    const skips = size * (number - 1);
    messages = await Message.find({
      chat: req.query.id,
    })
      .skip(skips)
      .limit(size)
      .populate('sender', '_id name photo')
      .populate('readBy', '_id name photo')
      .sort('-createdAt')
      .exec();
  }

  res.status(200).json(messages);
});

const readMessageByUser = catchAsync(async (req, res, next) => {
  await Message.updateMany(
    { chat: req.query.id },
    { $addToSet: { readBy: req.user._id } }
  );
  res.sendStatus(204);
});

export { createMessage, getMessagesByChatId, readMessageByUser };
