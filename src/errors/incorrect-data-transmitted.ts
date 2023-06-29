import { INCORRECT_TRANSMITTED_DATA_ERROR_CODE } from '../constants/error-code';
import utils from '../utils/utils';

export default class IncorrectDataTransmitted extends Error {
  protected statusCode: number;

  constructor(message: string = '', bdError = false) {
    const defaultErrorText: string = 'Переданы некорректные данные.';
    if (bdError) {
      super(`${defaultErrorText} ${message}`);
    } else {
      super(`${defaultErrorText} ${utils.getPureMessageFromError(message)}`);
    }

    this.statusCode = INCORRECT_TRANSMITTED_DATA_ERROR_CODE;
  }
}
