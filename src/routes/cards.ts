import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const interactionCardsCelebrateObj = {
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    user: Joi.object().required(),
  }),
};

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
    user: Joi.object().required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate(interactionCardsCelebrateObj), deleteCard);

router.put('/:cardId/likes', celebrate(interactionCardsCelebrateObj), likeCard);

router.delete('/:cardId/likes', celebrate(interactionCardsCelebrateObj), dislikeCard);

export default router;
