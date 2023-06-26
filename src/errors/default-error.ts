import { getPureMessageFromError } from "../utils/utils";
import { DEFAULT_ERROR_CODE } from "../constants/error-code";

export default class defaultError extends Error {
  private statusCode: number;

  constructor(message?: string) {
    const defaultErrorText: string = "Ошибка сервера";
    super(defaultErrorText + " " + getPureMessageFromError(message));
    this.statusCode = DEFAULT_ERROR_CODE;
  }
}
