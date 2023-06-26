import { Request, Response } from "express";
import User from "../models/user";
import defaultError from "../errors/default-error";
import NotFoundError from "../errors/not-found-err";
import IncorrectDataTransmitted from "../errors/incorrect-data-transmitted";

const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      throw new defaultError();
    });
};

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      throw new defaultError();
    });
};

const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.send({ data: user });
    })
    .catch((err) => {
      throw new defaultError();
    });
};

const updateProfile = (req: Request, res: Response) => {
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
        throw new NotFoundError();
      }
      res.send({ data: user });
    })
    .catch((err) => {
      throw new defaultError();
    });
};

const updateAvatar = (req: Request, res: Response) => {
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
        throw new NotFoundError();
      }
      res.send({ data: user });
    })
    .catch((err) => {
      throw new defaultError();
    });
};

export default {
  getUser,
  getUsers,
  createUser,
  updateAvatar,
  updateProfile,
};
