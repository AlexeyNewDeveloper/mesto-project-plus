import { USER_ALREDY_EXIST } from '../constants/error-code';
import IncorrectDataTransmitted from './incorrect-data-transmitted';

export default class UserAlredyExistError extends IncorrectDataTransmitted {
  constructor(message: string = '', bdError = false) {
    super(message, bdError);
    this.statusCode = USER_ALREDY_EXIST;
  }
}
