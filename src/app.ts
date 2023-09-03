import express, {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';
import validator from 'validator';
import mongoose from 'mongoose';
import { errors, celebrate, Joi } from 'celebrate';
import routes from './routes';
import UsersControllers from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import NotFoundPageError from './errors/not-found-page';
import appConfig from './config/app-config';
import { IRequest } from './types/types';

const app = express();
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // res.status(err).send({ message: err });
  res.status(err.statusCode).send({ message: err.message });
};

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger.requestLogger);

app.use((req: IRequest, res, next) => {
  if (!req.user) {
    req.user = { _id: '' };
  }
  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((email) => {
      if (validator.isEmail(email)) {
        return email;
      }
      return false;
    }),
    password: Joi.string().required(),
  }),
}), UsersControllers.login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((email) => {
      if (validator.isEmail(email)) {
        return email;
      }
      return false;
    }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/),
  }),
}), UsersControllers.createUser);

app.use(auth);

app.use('/users', routes.usersRouter);
app.use('/cards', routes.cardsRouter);

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundPageError());
  return null;
});

app.use(logger.errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(appConfig.PORT, () => {
  console.log('Сервер запущен.');
});
