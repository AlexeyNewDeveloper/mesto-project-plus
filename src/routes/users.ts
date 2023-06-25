// import { createUser } from '../controllers/users';
import { Router } from "express";
import { getUsers } from "../controllers/users";

const router = Router();

export default router.get("/", getUsers);
