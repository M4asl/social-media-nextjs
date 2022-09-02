import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createSendToken } from '../utils/createToken';
import { serialize } from 'cookie';

const register = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('Please provide email and password!', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

const hasAuthorization = catchAsync(async (req, res, next) => {
  const userProfile = await User.findById(req.query.id);
  const authorized = await (userProfile &&
    req.user &&
    userProfile._id.toString() == req.user._id.toString());
  if (!authorized) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }
  next();
});

const getCurrentUserProfile = catchAsync(async (req, res) => {
  const currentUserProfile = await User.findById(req.user._id);

  res.status(200).json(currentUserProfile);
});

const logout = (req, res) => {
  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      maxAge: -1,
      path: '/',
    })
  );
  return res.status('200').json({
    message: 'signed out',
  });
};

export {
  register,
  login,
  hasAuthorization,
  getCurrentUserProfile,
  logout,
};
