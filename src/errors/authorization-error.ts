import utils from '../utils/utils';
import { DENIAL_OF_ACCESS } from '../constants/error-code';

export default class AuthorizationError extends Error {
  private statusCode: number;

  constructor(message?: string, bdError = false) {
    const defaultErrorText: string = 'Ошибка авторизации.';
    if (bdError) {
      super(`${defaultErrorText} ${message}`);
    } else {
      super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    }
    this.statusCode = DENIAL_OF_ACCESS;
  }
}
