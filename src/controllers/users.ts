import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import DefaultError from '../errors/default-error';
import NotFoundError from '../errors/not-found-err';
import DenialOfAccessError from '../errors/denial-of-access-error';
import UserAlredyExistError from '../errors/user-alredy-exist-error';
import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';
import errorNames from '../constants/error-names';

const getMyProfile = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;

  User.findById(user._id)
    .then((userProfile) => {
      if (!userProfile) {
        next(new NotFoundError());
        return;
      }
      res.send({ data: userProfile });
    })
    .catch((err) => {
      next(new DefaultError(err.message));
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.set({
        'Set-Cookie': `token=${token}`,
      });
      res.send({ token });
    })
    .catch((err: Error) => {
      next(new DenialOfAccessError(err.message, true));
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
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserAlredyExistError(err.message));
        return;
      }
      if (err.name === errorNames.VALIDATION_FIELD_ERROR) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      next(new DefaultError());
    });
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

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

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
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
      if (err.name === errorNames.VALIDATION_FIELD_ERROR) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      next(new DefaultError());
    });
};

const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.body.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      upsert: true,
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
      if (err.name === errorNames.VALIDATION_FIELD_ERROR) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      next(new DefaultError());
    });
};

export default {
  getMyProfile,
  login,
  getUser,
  getUsers,
  createUser,
  updateAvatar,
  updateProfile,
};
