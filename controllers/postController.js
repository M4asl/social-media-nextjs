import cloudinary from 'cloudinary';
import Post from '../models/postModel';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import {
  newLikeNotifiaction,
  newCommentNotification,
  removeLikeNotification,
  removeCommentNotification,
} from './notificationController';
import { uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const listNewsFeed = catchAsync(async (req, res) => {
  const { pageNumber } = req.query;
  const number = Number(pageNumber);
  const size = 3;
  const user = await User.findById(req.user._id);
  const { following, _id } = user;
  following.push(_id);
  let posts;
  if (number === 1) {
    posts = await Post.find({
      postedBy: { $in: following },
    })
      .limit(size)
      .populate('likes', '_id name')
      .populate('comments.postedBy', '_id name photo')
      .populate('postedBy', '_id name photo')
      .sort('-created')
      .exec();
  } else {
    const skips = size * (number - 1);
    posts = await Post.find({
      postedBy: { $in: following },
    })
      .skip(skips)
      .limit(size)
      .populate('likes', '_id name')
      .populate('comments.postedBy', '_id name photo')
      .populate('postedBy', '_id name photo')
      .sort('-created')
      .exec();
  }

  res.json(posts);
});

const listByUser = catchAsync(async (req, res) => {
  const posts = await Post.find({ postedBy: req.query.id })
    .populate('likes', '_id name')
    .populate('comments.postedBy', '_id name photo')
    .populate('postedBy', '_id name photo')
    .sort('-created')
    .exec();

  res.json(posts);
});

const createPost = catchAsync(async (req, res) => {
  const user = await User.findById(req.query.id).select(
    '_id name photo'
  );

  let photoData = {};

  if (req.body.photo !== '') {
    const result = await cloudinary.v2.uploader.upload(
      req.body.photo,
      {
        folder: 'NextSocialMedia/posts',
        crop: 'scale',
      }
    );

    photoData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const postFormData = {
    text: req.body.text,
    postedBy: user,
    photo: photoData,
  };
  const post = await Post.create(postFormData);

  res.json(post);
});

const removePost = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.query.id);
  return res.status(204).json(post);
});

const likePost = catchAsync(async (req, res, next) => {
  const likedPost = await Post.findById(req.body.postId);

  const isLiked =
    likedPost.likes.filter(
      (like) => like.toString() === req.body.likeId
    ).length > 0;
  if (isLiked) {
    return next(new AppError('Post already liked', 404));
  }

  await Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.body.likeId },
  });
  const userToNotifyId = likedPost.postedBy;
  await newLikeNotifiaction(
    req.body.likeId,
    req.body.postId,
    userToNotifyId
  );
  next();
});

const likedPost = catchAsync(async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.likeId,
    { $push: { liked: req.body.postId } },
    { new: true }
  )
    .select('liked')
    .populate('liked', '_id text')
    .exec();
  res.json(result);
});

const unlikePost = catchAsync(async (req, res, next) => {
  const unlikedPost = await Post.findById(req.body.postId);

  const isUnliked = unlikedPost.likes.find(
    (like) => like.toString() === req.body.unlikeId
  );

  if (!isUnliked) {
    return next(new AppError('Post already unliked', 404));
  }

  await Post.findByIdAndUpdate(req.body.postId, {
    $pull: { likes: req.body.unlikeId },
  });
  const userToNotifyId = unlikedPost.postedBy;
  await removeLikeNotification(
    req.body.unlikeId,
    req.body.postId,
    userToNotifyId
  );
  next();
});

const unlikedPost = catchAsync(async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.unlikeId,
    { $pull: { liked: req.body.postId } },
    { new: true }
  )
    .populate('liked', '_id name')
    .exec();
  res.json(result);
});

const findLikesPost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.query.id);
  const { likes } = post;
  const users = await User.find({ _id: { $in: likes } }).select(
    'name'
  );
  res.json(users);
});

const comment = catchAsync(async (req, res) => {
  const { comment } = req.body;
  comment._id = uuidv4();
  comment.postedBy = req.body.userId;
  comment.text = req.body.comment.text;

  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name photo')
    .populate('postedBy', '_id name photo')
    .exec();
  const userToNotifyId = result.postedBy._id;
  const commentId = comment._id;
  await newCommentNotification(
    req.body.userId,
    userToNotifyId,
    req.body.postId,
    commentId,
    comment.text
  );
  res.json(result);
});

const uncomment = catchAsync(async (req, res) => {
  const { comment } = req.body;

  const post = await Post.findById(req.body.postId);

  const commentPostedBy = await Post.find(
    { comments: { $elemMatch: { _id: comment._id } } },
    { 'comments.$': 1 }
  );

  // console.log(commentPostedBy[0].comments[0].postedBy);
  const commentPostedById = commentPostedBy[0].comments[0].postedBy;
  const userToNotifyId = post.postedBy;

  const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name photo')
    .populate('postedBy', '_id name photo')
    .exec();

  await removeCommentNotification(
    req.body.postId,
    comment._id,
    commentPostedById,
    userToNotifyId
  );
  res.json(result);
});

const isPoster = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.query.id);
  const authorized = await (post &&
    req.user &&
    post.postedBy._id.toString() == req.user._id.toString());
  if (!authorized) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }
  next();
});

export {
  listNewsFeed,
  listByUser,
  createPost,
  removePost,
  likePost,
  likedPost,
  unlikePost,
  unlikedPost,
  findLikesPost,
  comment,
  uncomment,
  isPoster,
};
