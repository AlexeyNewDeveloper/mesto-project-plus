import utils from '../utils/utils';
import { DEFAULT_ERROR_CODE } from '../constants/error-code';

export default class DefaultError extends Error {
  private statusCode: number;

  constructor(message?: string, bdError = false) {
    const defaultErrorText: string = 'Ошибка сервера';
    if (bdError) {
      super(`${defaultErrorText} ${message}`);
    } else {
      super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    }
    this.statusCode = DEFAULT_ERROR_CODE;
  }
}
