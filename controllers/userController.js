import cloudinary from 'cloudinary';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createSendToken } from '../utils/createToken';
import {
  newFollowNotification,
  removeFollowNotification,
} from './notificationController';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllUsers = catchAsync(async (req, res, next) => {
  let searchObj = req.query;

  if (req.query.search !== undefined) {
    searchObj = {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ],
    };
  }

  const users = await User.find(searchObj).select(
    'name email created photo'
  );

  if (req.query.search && users.length === 0) {
    return next(
      new AppError('Not found user with this name or email', 404)
    );
  }

  res.status(200).json(users);
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.query.id)
    .populate('liked', '_id text')
    .populate('following', '_id, name')
    .populate('followers', '_id, name');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  return res.status(200).json(user);
});

const filterObjField = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword'
      )
    );
  }

  const filteredBodyField = filterObjField(
    req.body,
    'about',
    'facebook',
    'instagram',
    'twitter',
    'youtube',
    'photo'
  );

  let photoData = {};

  if (req.body.photo !== '') {
    const result = await cloudinary.v2.uploader.upload(
      req.body.photo,
      {
        folder: 'NextSocialMedia/users',
        crop: 'scale',
      }
    );

    photoData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  filteredBodyField.photo = photoData;

  const user = await User.findByIdAndUpdate(
    req.query.id,
    filteredBodyField,
    { new: true, runValidators: true }
  );
  createSendToken(user, 200, req, res);
});

const removeUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.query.id);
  if (!user) {
    return next(new AppError('Not found user', 404));
  }
  return res.status(204).json(null);
});

const addFollowing = catchAsync(async (req, res, next) => {
  // const followUser = await User.findById(req.body.userId);

  // const isFollowing =
  //   followUser.following.filter(
  //     (follow) => follow.toString() === req.body.followId,
  //   ).length > 0;

  // if (isFollowing) {
  //   return next(new AppError("You already follow this user.", 404));
  // }

  await User.findByIdAndUpdate(req.body.userId, {
    $push: { following: req.body.followId },
  });
  next();
});

const addFollower = catchAsync(async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec();
  await newFollowNotification(req.body.userId, req.body.followId);
  res.json(result);
});

const removeFollowing = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.body.userId, {
    $pull: { following: req.body.unfollowId },
  });
  next();
});

const removeFollower = catchAsync(async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec();
  await removeFollowNotification(
    req.body.userId,
    req.body.unfollowId
  );
  res.json(result);
});

const findPeople = catchAsync(async (req, res) => {
  const user = await User.findById(req.query.id);
  const { following } = user;
  following.push(user._id);

  const users = await User.find({ _id: { $nin: following } }).select(
    'name photo'
  );
  res.json(users);
});

export {
  getAllUsers,
  getUser,
  updateUser,
  removeUser,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
};
