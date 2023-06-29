// import { createUser } from '../controllers/users';
import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import UsersControllers from '../controllers/users';

const router = Router();

router.get('/', UsersControllers.getUsers);

router.get('/me', UsersControllers.getMyProfile);

router.get('/:userId', UsersControllers.getUser);

router.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).unknown(true),
}), UsersControllers.updateProfile);

router.patch(
  '/me/avatar',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
    }).unknown(true),
  }),
  UsersControllers.updateAvatar,
);

export default router;
