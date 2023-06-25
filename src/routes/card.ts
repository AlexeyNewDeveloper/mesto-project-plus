import { Router } from "express";
import { deleteCard } from "../controllers/card";

const router = Router();

export default router.delete("/", deleteCard);
