import { Router } from "express";
import cardRouter from "./card";
import { getCards, createCard } from "../controllers/cards";

const router = Router();

router.get("/", getCards);
router.post("/", createCard);
router.use("/:cardId", cardRouter);

export default router;
