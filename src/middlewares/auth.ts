import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import DenialOfAccessError from '../errors/denial-of-access-error';
import SECRET from '../constants/secret';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new DenialOfAccessError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return new DenialOfAccessError('Необходима авторизация');
  }
  req.body.user = payload;

  next();
  return null;
};
