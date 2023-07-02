import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import UsersControllers from '../controllers/users';
// import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';

const router = Router();

router.get('/', UsersControllers.getUsers);

router.get('/me', UsersControllers.getMyProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), UsersControllers.getUserByParamId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    user: Joi.object().required(),
  }),
}), UsersControllers.updateProfile);

router.patch(
  '/me/avatar',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
      user: Joi.object().required(),
    }),
  }),
  UsersControllers.updateAvatar,
);

export default router;
