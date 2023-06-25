import { Request, Response } from "express";
import Card from "../models/card";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link, owner } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
