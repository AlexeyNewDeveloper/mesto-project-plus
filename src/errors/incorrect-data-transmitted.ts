import { INCORRECT_TRANSMITTED_DATA_ERROR_CODE } from "../constants/error-code";

export default class IncorrectDataTransmitted extends Error {
  private statusCode: number;

  constructor(message: string = "") {
    const defaultErrorText: string = "Переданы некорректные данные.";
    super(defaultErrorText + " " + message);
    this.statusCode = INCORRECT_TRANSMITTED_DATA_ERROR_CODE;
  }
}
