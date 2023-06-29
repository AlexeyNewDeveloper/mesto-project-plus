import { USER_ALREDY_EXIST } from '../constants/error-code';
import IncorrectDataTransmitted from './incorrect-data-transmitted';

export default class UserAlredyExistError extends IncorrectDataTransmitted {
  constructor(message: string = '', bdError = true) {
    const defaultErrorText: string = 'Такой пользователь уже существует.';
    const fullMessage = `${defaultErrorText} ${message}`;
    super(fullMessage, bdError);
    this.statusCode = USER_ALREDY_EXIST;
  }
}
