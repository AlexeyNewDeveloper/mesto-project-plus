import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import DenialOfAccessError from '../errors/denial-of-access-error';
import SECRET from '../constants/secret';
import { IRequest } from '../types/types';

export default (req: IRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new DenialOfAccessError('Необходима авторизация', true));
    return null;
    // return new DenialOfAccessError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    next(new DenialOfAccessError('Необходима авторизация', true));
    return null;
  }

  if (typeof payload === 'object' && payload._id && req.user) {
    req.user._id = payload._id;
  } else if (typeof payload === 'string' && req.user) {
    req.user._id = payload;
  }

  next();
  return null;
};
