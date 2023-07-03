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
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate(interactionCardsCelebrateObj), deleteCard);

router.put('/:cardId/likes', celebrate(interactionCardsCelebrateObj), likeCard);

router.delete('/:cardId/likes', celebrate(interactionCardsCelebrateObj), dislikeCard);

export default router;
