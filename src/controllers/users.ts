import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import DefaultError from '../errors/default-error';
import NotFoundError from '../errors/not-found-err';
import UserAlredyExistError from '../errors/user-alredy-exist-error';
import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';
import SECRET from '../constants/secret';

interface IUserDataFields {
  [name: string]: string;
}

interface IUpdateUserDataParamsFunc {
  userId: string;
  fields: IUserDataFields;
  res: Response;
  next: NextFunction
}

const getUser = (userId: string, res: Response, next: NextFunction) => {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError());
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(new DefaultError(err.message));
    });
};

const getMyProfile = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;
  getUser(user._id, res, next);
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.set({
        'Set-Cookie': `token=${token}`,
      });
      res.send({ message: 'Успешно.' });
    })
    .catch((err: Error) => {
      next(new DefaultError(err.message));
    });
};

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(new DefaultError(err));
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      const { password: createdPass, ...createdUser } = user.toObject();
      res.send({
        data: createdUser,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      if (err.code === 11000) {
        next(new UserAlredyExistError());
        return;
      }
      next(new DefaultError());
    });
};

const getUserByParamId = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  getUser(userId, res, next);
};

const updateUserData = ({
  userId, fields, res, next,
}: IUpdateUserDataParamsFunc) => User.findByIdAndUpdate(
  userId,
  fields,
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      next(new NotFoundError());
      return;
    }
    res.send({ data: user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new IncorrectDataTransmitted(err.message));
      return;
    }
    next(new DefaultError());
  });

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  updateUserData({
    userId, fields: { name, about }, res, next,
  });
};

const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.body.user._id;
  updateUserData({
    userId, fields: { avatar }, res, next,
  });
};

export default {
  getMyProfile,
  login,
  getUserByParamId,
  getUsers,
  createUser,
  updateAvatar,
  updateProfile,
};
