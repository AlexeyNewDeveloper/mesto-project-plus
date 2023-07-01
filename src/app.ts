import express, {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import UsersControllers from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import NotFoundPageError from './errors/not-found-page';

const { PORT = 3000 } = process.env;

const app = express();
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
};

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger.requestLogger);

app.post('/signin', UsersControllers.login);
app.post('/signup', UsersControllers.createUser);

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

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
