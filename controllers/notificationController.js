import catchAsync from '../utils/catchAsync';
import Notification from '../models/notificationModel';

const getNotificationByUser = catchAsync(async (req, res) => {
  const notifications = await Notification.find({
    userToNotify: req.user._id,
  })
    .populate('user', '_id name photo followers')
    .populate('post', '_id text photo')
    .exec();
  res.json(notifications);
});

const newLikeNotifiaction = catchAsync(
  async (userId, postId, userToNotifyId) => {
    // const userToNotify = await User.findById(userToNotifyId);

    const notifyLikeData = {
      type: 'newLike',
      user: userId,
      userToNotify: userToNotifyId,
      post: postId,
    };

    await Notification.create(notifyLikeData);
  }
);

const removeLikeNotification = catchAsync(
  async (userId, postId, userToNotifyId) => {
    const notifications = await Notification.find({
      userToNotify: userToNotifyId,
    });

    const notificationsToRemove = await notifications.find(
      (notification) =>
        notification.type === 'newLike' &&
        notification.user.toString() === userId &&
        notification.post.toString() === postId
    );

    await Notification.findByIdAndDelete(notificationsToRemove._id);
  }
);

const newFollowNotification = catchAsync(
  async (userId, userToNotifyId) => {
    const notifyFollowData = {
      type: 'newFollower',
      user: userId,
      userToNotify: userToNotifyId,
    };
    await Notification.create(notifyFollowData);
  }
);

const removeFollowNotification = catchAsync(
  async (userId, userToNotifyId) => {
    const notifications = await Notification.find({
      userToNotify: userToNotifyId,
    });

    const notificationsToRemove = await notifications.find(
      (notification) =>
        notification.type === 'newFollower' &&
        notification.user.toString() === userId
    );

    await Notification.findByIdAndDelete(notificationsToRemove._id);
  }
);

const newCommentNotification = async (
  userId,
  userToNotifyId,
  postId,
  commentId,
  text
) => {
  try {
    const notifyCommentData = {
      type: 'newComment',
      user: userId,
      userToNotify: userToNotifyId,
      post: postId,
      commentId,
      text,
    };
    await Notification.create(notifyCommentData);
  } catch (err) {
    console.error(err);
  }
};

const removeCommentNotification = async (
  postId,
  commentId,
  userId,
  userToNotifyId
) => {
  try {
    const notifications = await Notification.find({
      userToNotify: userToNotifyId,
    });
    const notificationToRemove = await notifications.find(
      (notification) =>
        notification.type === 'newComment' &&
        notification.post.toString() === postId.toString() &&
        notification.user.toString() === userId.toString() &&
        notification.commentId === commentId.toString()
    );
    // console.log("notifications", notifications);
    // console.log(postId, commentId, userId, userToNotifyId);
    // console.log(notificationToRemove);
    await Notification.findByIdAndDelete(notificationToRemove._id);
  } catch (err) {
    console.error(err);
  }
};

export {
  getNotificationByUser,
  newLikeNotifiaction,
  removeLikeNotification,
  newFollowNotification,
  removeFollowNotification,
  newCommentNotification,
  removeCommentNotification,
};
