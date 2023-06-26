import { DEFAULT_ERROR_CODE } from "../constants/error-code";

export default class defaultError extends Error {
  private statusCode: number;

  constructor(message?: string) {
    const defaultErrorText: string = "Ошибка сервера";
    super(message || defaultErrorText);
    this.statusCode = DEFAULT_ERROR_CODE;
  }
}
