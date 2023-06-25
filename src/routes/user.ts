import { Router } from "express";
import { getUser } from "../controllers/user";

const router = Router();

export default router.get("/", getUser);
