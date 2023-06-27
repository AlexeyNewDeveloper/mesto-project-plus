// import { createUser } from '../controllers/users';
import { Router } from 'express';
import UsersControllers from '../controllers/users';

const router = Router();

router.get('/', UsersControllers.getUsers);
router.post('/', UsersControllers.createUser);
router.get('/:userId', UsersControllers.getUser);
router.patch('/me', UsersControllers.updateProfile);
router.patch('/me/avatar', UsersControllers.updateAvatar);

export default router;
