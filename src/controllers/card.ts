import { Request, Response } from "express";
import Card from "../models/card";

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
