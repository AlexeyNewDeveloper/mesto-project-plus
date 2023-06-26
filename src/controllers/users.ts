import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import defaultError from "../errors/default-error";
import NotFoundError from "../errors/not-found-err";
import IncorrectDataTransmitted from "../errors/incorrect-data-transmitted";

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(new defaultError(err));
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err) {
        next(new IncorrectDataTransmitted(err.message));
      }
      next(new defaultError(err.message));
    });
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError());
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(new defaultError(err.message));
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
      upsert: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError());
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err) {
        next(new IncorrectDataTransmitted(err.message));
      }
      next(new defaultError(err.message));
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
    }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError());
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err) {
        next(new IncorrectDataTransmitted(err.message));
      }
      next(new defaultError(err.message));
    });
};

export default {
  getUser,
  getUsers,
  createUser,
  updateAvatar,
  updateProfile,
};
