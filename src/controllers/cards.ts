import { Request, Response } from "express";
import Card from "../models/card";
import defaultError from "../errors/default-error";
import NotFoundError from "../errors/not-found-err";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      throw new defaultError();
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link, user } = req.body;

  return Card.create({ name, link, owner: user })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      throw new defaultError();
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }

      res.send({ data: card });
    })
    .catch((err) => {
      throw new defaultError();
    });
};

export const likeCard = (req: Request, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }

      res.send({ data: card });
    })
    .catch((err) => {
      throw new defaultError();
    });

export const dislikeCard = (req: Request, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }

      res.send({ data: card });
    })
    .catch((err) => {
      throw new defaultError();
    });
