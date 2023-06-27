import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import DefaultError from '../errors/default-error';
import NotFoundError from '../errors/not-found-err';
import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(new DefaultError(err));
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link, user } = req.body;

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
      if (err) {
        next(new IncorrectDataTransmitted(err.message));
      }
      next(new DefaultError(err.message));
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError());
      }

      res.send({ data: card });
    })
    .catch((err) => {
      next(new DefaultError(err.message));
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError());
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err) {
        next(new IncorrectDataTransmitted(err.message));
      }
      next(new DefaultError(err.message));
    });
};

// eslint-disable-next-line max-len
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.body.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      next(new NotFoundError());
    }

    res.send({ data: card });
  })
  .catch((err) => {
    if (err) {
      next(new IncorrectDataTransmitted(err.message));
    }
    next(new DefaultError(err.message));
  });
