import { NOT_FOUND_ERROR_CODE } from "../constants/error-code";

export default class NotFoundError extends Error {
  private statusCode: number;

  constructor(message?: string) {
    const defaultErrorText: string = "Карточка или пользователь не найден";
    super(message || defaultErrorText);
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}
