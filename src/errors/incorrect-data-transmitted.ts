export default class IncorrectDataTransmitted extends Error {
  private statusCode: number;

  constructor(message?: string) {
    const defaultErrorText: string = "Переданы некорректные данные";
    super(message || defaultErrorText);
    this.statusCode = 400;
  }
}
