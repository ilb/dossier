import Exception from "./Exception.js";

export default class ForbiddenException extends Exception {
  /**
   * @param {string} message Сообщение ошибки.
   */
  constructor(message = "Доступ запрещен!") {
    super();
    this.type = "FORBIDDEN";
    this.status = 403;
    this.message = message;
  }
}
