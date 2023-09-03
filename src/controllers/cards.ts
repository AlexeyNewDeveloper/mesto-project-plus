import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import DefaultError from '../errors/default-error';
import NotFoundError from '../errors/not-found-err';
import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';
import DenialOfAccessError from '../errors/denial-of-access-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(new DefaultError(err));
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  console.log('createCard', req.user);
  const { name, link } = req.body;
  const { user } = req;
  return Card.create({ name, link, owner: user })
    .then((card) => {
      card
        .populate('owner')
        .then((populateCard) => {
          res.send({ data: populateCard });
        })
        .catch((err) => {
          next(new DefaultError(err.message));
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      next(new DefaultError());
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError());
        return null;
      }
      if (!req.user || req.user._id !== card.owner.toString()) {
        next(new DenialOfAccessError());
        return null;
      }
      return card.remove().then((removedCard) => res.send({ data: removedCard }));
    })
    .catch((err) => {
      next(new DefaultError(err.message));
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError());
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectDataTransmitted(err.message));
        return;
      }
      next(new DefaultError());
    });
};

// eslint-disable-next-line max-len
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(new NotFoundError());
      return;
    }

    res.send({ data: card });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new IncorrectDataTransmitted(err.message));
      return;
    }
    next(new DefaultError());
  });
