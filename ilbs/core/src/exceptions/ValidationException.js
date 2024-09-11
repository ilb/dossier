import Exception from "./Exception.js";

export default class ValidationException extends Exception {
  /**
   * @param {string} message Сообщение об ошибке валидации.
   */
  constructor(message) {
    super();
    this.type = "VALIDATION";
    this.status = 400;
    this.message = message;
  }
}
