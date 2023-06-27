import utils from '../utils/utils';
import { DEFAULT_ERROR_CODE } from '../constants/error-code';

export default class DefaultError extends Error {
  private statusCode: number;

  constructor(message?: string) {
    const defaultErrorText: string = 'Ошибка сервера';
    super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    this.statusCode = DEFAULT_ERROR_CODE;
  }
}
