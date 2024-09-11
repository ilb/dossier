import Exception from "./Exception.js";

export default class CriticalException extends Exception {
  /**
   * @param {string} message Сообщение об ошибке.
   */
  constructor(message) {
    super();
    this.type = "CRITICAL";
    this.status = 500;
    this.message = message;
  }
}
