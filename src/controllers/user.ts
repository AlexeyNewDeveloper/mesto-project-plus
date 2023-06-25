import { Request, Response } from "express";
import User from "../models/user";

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
