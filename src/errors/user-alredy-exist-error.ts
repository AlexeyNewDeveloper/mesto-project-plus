import utils from '../utils/utils';
import { USER_ALREDY_EXIST } from '../constants/error-code';

export default class UserAlredyExistError extends Error {
  private statusCode: number;

  constructor(message: string = '', bdError = true) {
    const defaultErrorText: string = 'Такой пользователь уже существует.';
    if (bdError) {
      super(`${defaultErrorText} ${message}`);
    } else {
      super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    }
    this.statusCode = USER_ALREDY_EXIST;
  }
}
