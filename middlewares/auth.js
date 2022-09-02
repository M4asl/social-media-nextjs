import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

const protect = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

export { protect };
