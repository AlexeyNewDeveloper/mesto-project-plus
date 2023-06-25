import { Router } from "express";
import { deleteCard, likeCard, dislikeCard } from "../controllers/cards";

const router = Router();

router.delete("/", deleteCard);
router.put("/likes", likeCard);
router.delete("/likes", dislikeCard);

export default router;
