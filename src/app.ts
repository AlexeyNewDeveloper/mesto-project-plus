import express, {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import { errors, celebrate, Joi } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import UsersControllers from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import NotFoundPageError from './errors/not-found-page';
import appConfig from './config/app-config';

const app = express();
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
};

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger.requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom((value) => validator.isEmail(value)).required(),
    password: Joi.string().required(),
  }),
}), UsersControllers.login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom((value) => validator.isEmail(value)).required(),
    password: Joi.string().required(),
    name: Joi.string().pattern(/[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/),
    about: Joi.string().pattern(/[A-Za-z\u0410-\u044F\u0401\u0451]{2,200}/),
    avatar: Joi.string().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
  }),
}), UsersControllers.createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundPageError());
  return null;
});

app.use(logger.errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(appConfig.PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
