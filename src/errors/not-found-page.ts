import utils from '../utils/utils';
import { NOT_FOUND_ERROR_CODE } from '../constants/error-code';

export default class NotFoundPageError extends Error {
  protected statusCode: number;

  constructor(message?: string, bdError = false) {
    const defaultErrorText: string = 'Такой страницы не существует.';
    if (bdError) {
      super(`${defaultErrorText} ${message}`);
    } else {
      super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    }
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}
