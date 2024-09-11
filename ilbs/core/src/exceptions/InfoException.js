import Exception from "./Exception.js";

export default class InfoException extends Exception {
  /**
   * @param {string} message Сообщение об исключении.
   */
  constructor(message) {
    super();
    this.type = "INFO";
    this.status = 412;
    this.message = message;
  }
}
