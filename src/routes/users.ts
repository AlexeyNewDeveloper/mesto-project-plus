// import { createUser } from '../controllers/users';
import { Router } from "express";
import { getUsers, createUser } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
